import type { Server } from 'socket.io';
import { randomRoomId } from './misc';

type Event<T> = (data: T) => void;
type EmptyEvent = () => void;

export const MAX_PLAYERS = 10;

export interface ClientToServerEvents {
	createRoom: Event<{ roomId: string }>;
	joinRoom: Event<{ roomId: string; name: string, image?: ArrayBuffer}>;
	startGame: EmptyEvent;
	assignTurn: Event<{ userId: string }>;
	submitAnswer: Event<{ answer: number }>;
	endGame: EmptyEvent;
	joinTeam: Event<{ team: number }>;
	error: Event<{ error: string }>;
	backToLobby: EmptyEvent;
	assignHost: Event<{ userId: string }>;
	deleteRoom: EmptyEvent;
}

export interface ServerToClientEvents {
	createRoom: Event<{ roomId: string }>;
	joinRoom: Event<{ userId: string; name: string, image?: ArrayBuffer }>;
	startGame: EmptyEvent;
	assignTurn: Event<{ userId: string }>;
	submitAnswer: Event<{ answer: number; userId: string }>;
	endGame: EmptyEvent;
	joinTeam: Event<{ team: number; userId: string }>;
	error: Event<{ error: string }>;
	backToLobby: EmptyEvent;
	assignHost: EmptyEvent;
	playerDisconnected: Event<{ userId: string }>;
	lobbyDisconnected: EmptyEvent;
	deleteRoom: EmptyEvent;
}

export function configureServer(io: Server<ClientToServerEvents, ServerToClientEvents>){
	const rooms = new Map<string, number>();

	io.on('connection', (socket) => {
		console.log(`Socket ${socket.id} connected`);

		const userId = socket.id;
		let isLobby = false;
		let roomId: string | undefined;

		function noRoomId(): void {
			console.log('User tried to perform action while not being in a room');
			socket.emit('error', { error: 'Not in a room' });
		}

		socket.on('createRoom', (data) => {
			roomId = data.roomId;
			while (rooms.has(roomId)) {
				roomId = randomRoomId();
			}
			console.log(`Socket ${userId} created room ${roomId}`);
			isLobby = true;
			rooms.set(roomId, MAX_PLAYERS);
			socket.join(roomId);
			socket.emit('createRoom', { roomId });
		});

		socket.on('joinRoom', async (data) => {
			const capacity = rooms.get(data.roomId);
			if (capacity === undefined) {
				socket.emit('error', { error: 'Room not found' });
				return;
			} else if (capacity === 0) {
				socket.emit('error', { error: 'Room is full' });
				return;
			}
			rooms.set(data.roomId, capacity - 1); // Decrease the available capacity
			console.log(`Socket ${socket.id} joined room ${data.roomId}`);
			if (data.image) {
				console.log(`Room ${roomId}: Received image from ${userId}`);
			}
			roomId = data.roomId;
			socket.join(roomId);
			io.sockets.in(roomId).emit('joinRoom', { userId, name: data.name, image: data.image });
		});

		socket.on('startGame', () => {
			if (!roomId) return noRoomId();
			console.log(`Room ${roomId} started game`);
			socket.to(roomId).emit('startGame');
		});

		socket.on('endGame', () => {
			if (!roomId) return noRoomId();
			console.log(`Room ${roomId} ended game`);
			io.to(roomId).emit('endGame');
		});

		socket.on('assignTurn', ({ userId }) => {
			if (!roomId) return noRoomId();
			console.log(`Room ${roomId} assigned turn to ${userId}`);
			socket.to(roomId).emit('assignTurn', { userId });
		});

		socket.on('submitAnswer', ({ answer }) => {
			if (!roomId) return noRoomId();
			console.log(`Room ${roomId} submitted answer ${answer}`);
			io.to(roomId).emit('submitAnswer', { answer, userId });
		});

		socket.on('joinTeam', ({ team }) => {
			if (!roomId) return noRoomId();
			console.log(`Room ${roomId}: User ${userId} joined team ${team}`);
			socket.to(roomId).emit('joinTeam', { team, userId });
		});

		socket.on('backToLobby', () => {
			if (!roomId) return noRoomId();
			console.log(`Room ${roomId}: Back to lobby`);
			socket.to(roomId).emit('backToLobby');
		});

		socket.on('assignHost', ({ userId }) => {
			if (!roomId) return noRoomId();
			const reciever = io.sockets.sockets.get(userId);
			if (reciever === undefined) {
				const msg = `User ${userId} is not connected`;
				console.log(msg);
				socket.emit('error', { error: msg });
				return;
			}
			console.log(`Room ${roomId}: User ${userId} is now host`);
			reciever.emit('assignHost');
		});

		socket.on('deleteRoom', () => {
			if (!roomId) return noRoomId();
			if (!rooms.has(roomId)) {
				const msg = `Room ${roomId} does not exist`;
				console.log(msg);
				socket.emit('error', { error: msg });
				return;
			}
			console.log(`Room ${roomId}: Deleting room`);
			rooms.delete(roomId);
			io.to(roomId).emit('deleteRoom');
		});

		socket.on('disconnect', () => {
			console.log(`Socket ${socket.id}  disconnected`);
			if (isLobby && roomId) {
				console.log(`Lobby ${roomId} disconnected`);
				rooms.delete(roomId);
				io.to(roomId).emit('lobbyDisconnected');
			} else if (roomId && rooms.has(roomId)) {
				const capacity = rooms.get(roomId);
				if (capacity === undefined) return;
				rooms.set(roomId, capacity + 1);
				console.log(`Room ${roomId}: Sending playerDisconnected event for player ${userId}`);
				io.to(roomId).emit('playerDisconnected', { userId });
			}
		});
	});
}
