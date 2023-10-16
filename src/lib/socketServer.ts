import type { ViteDevServer } from 'vite';
import type { Server } from 'socket.io';
import { randomRoomId } from './misc';
import type { Server as HttpServer } from 'http';


type Event<T> = (data: T) => void;

export interface ClientToServerEvents {
	createRoom: Event<{ capacity: number; roomId: string }>;
	joinRoom: Event<{ roomId: string; name: string, image?: ArrayBuffer}>;
	startGame: () => void;
	assignTurn: Event<{ userId: string }>;
	submitAnswer: Event<{ answer: number }>;
	endGame: () => void;
	joinTeam: Event<{ team: number }>;
	error: Event<{ error: string }>;
	backToLobby: () => void;
	assignHost: Event<{ userId: string }>;
}

export interface ServerToClientEvents {
	createRoom: Event<{ roomId: string }>;
	joinRoom: Event<{ userId: string; name: string, image?: ArrayBuffer }>;
	startGame: () => void;
	assignTurn: Event<{ userId: string }>;
	submitAnswer: Event<{ answer: number; userId: string }>;
	endGame: () => void;
	joinTeam: Event<{ team: number; userId: string }>;
	error: Event<{ error: string }>;
	backToLobby: () => void;
	assignHost: () => void;
}

export function configureServer(io: Server<ClientToServerEvents, ServerToClientEvents>){

	const openRooms = new Map<string, number>();

	const socketsInRooms = new Map<string, Set<string>>(); // roomId -> Set of socket ids

	io.on('connection', (socket) => {
		console.log(`Socket ${socket.id} connected`);

		const userId = socket.id;
		let roomId: string | undefined;

		function noRoomId(): void {
			console.log('User tried to perform action while not being in a room');
			socket.emit('error', { error: 'Not in a room' });
		}

		socket.on('createRoom', (data) => {
			roomId = data.roomId;
			while (openRooms.has(roomId)) {
				roomId = randomRoomId();
			}
			console.log(`Socket ${userId} created room ${roomId}`);
			openRooms.set(roomId, data.capacity);
			socket.join(roomId);
			socket.emit('createRoom', { roomId });
		});

		socket.on('joinRoom', async (data) => {
			const capacity = openRooms.get(data.roomId);

			// Initialize the room in socketsInRooms if it's not already there
			if (!socketsInRooms.has(data.roomId)) {
				socketsInRooms.set(data.roomId, new Set());
			}

			const socketsInRoom = socketsInRooms.get(data.roomId);

			if (capacity === undefined) {
				socket.emit('error', { error: 'Room not found' });
				return;
			} else if (capacity === 0) {
				socket.emit('error', { error: 'Room is full' });
				return;
			} else if (socketsInRoom && socketsInRoom.has(userId)) {
				socket.emit('error', { error: 'You have already joined this room' });
				return;
			}

			console.log(`Socket ${socket.id} joined room ${data.roomId}`);
			openRooms.set(data.roomId, capacity - 1); // Decrease the available capacity
			if (socketsInRoom) {
				socketsInRoom.add(socket.id); // Add the socket to the room's set
			}
			roomId = data.roomId;
			socket.join(roomId);
			io.sockets.in(roomId).emit('joinRoom', { userId, name: data.name, image: data.image });
		});

		socket.on('startGame', () => {
			if (!roomId) return noRoomId();
			console.log(`Room ${roomId} started game`);
			socket.to(roomId).emit('startGame');
			openRooms.delete(roomId);
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

		socket.on('disconnect', () => {
			console.log(`Socket ${socket.id}  disconnected`);
		});
	});
}
