import type { ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';

export enum SocketEvents {
	CreateRoom = 'createRoom',
	JoinRoom = 'joinRoom',
	StartGame = 'startGame',
	AssignTurn = 'assignTurn',
	UpdateAnswer = 'updateAnswer',
	SubmitAnswer = 'submitAnswer',
	EndGame = 'endGame',
	Error = 'error',
	JoinTeam = 'joinTeam',
}

export type JoinPayload = {
    roomId: string;
    name: string;
};

function randomRoomId() {
	return (Math.random() + 1).toString(36).substring(2, 7);
}

export function configureServer(server: ViteDevServer) {
	if (!server.httpServer) return;

	const io = new Server(server.httpServer);

	const openRooms = new Map<string, number>();

	const socketsInRooms = new Map<string, Set<string>>(); // roomId -> Set of socket ids


	io.on('connection', (socket) => {
		console.log(`Socket ${socket.id} connected`);

		socket.on(SocketEvents.CreateRoom, (capacity: number) => {
			let roomId = randomRoomId();
			while (openRooms.has(roomId)) {
				roomId = randomRoomId();
			}
			console.log(`Socket ${socket.id} created room ${roomId}`);
			openRooms.set(roomId, capacity);
			socket.join(roomId);
			socket.emit(SocketEvents.CreateRoom, roomId);
		});

		socket.on(SocketEvents.JoinRoom, ({ roomId, name }: { roomId: string; name: string }) => {
			const capacity = openRooms.get(roomId);
		
			// Initialize the room in socketsInRooms if it's not already there
			if (!socketsInRooms.has(roomId)) {
				socketsInRooms.set(roomId, new Set());
			}
			
			const socketsInRoom = socketsInRooms.get(roomId);
		
			if (capacity === undefined) {
				socket.emit(SocketEvents.Error, { error: 'Room not found' });
				return;
			} else if (capacity === 0) {
				socket.emit(SocketEvents.Error, { error: 'Room is full' });
				return;
			} else if (socketsInRoom && socketsInRoom.has(socket.id)) {
				socket.emit(SocketEvents.Error, { error: 'You have already joined this room' });
				return;
			}
		
			console.log(`Socket ${socket.id} joined room ${roomId}`);
			openRooms.set(roomId, capacity - 1); // Decrease the available capacity
			if (socketsInRoom) {
				socketsInRoom.add(socket.id); // Add the socket to the room's set
			}
			socket.join(roomId);
			socket.to(roomId).emit(SocketEvents.JoinRoom, { userId: socket.id, name });
		});
		

		socket.on(SocketEvents.StartGame, ({ roomId }: { roomId: string }) => {
			console.log(`Room ${roomId} started game`);
			io.to(roomId).emit(SocketEvents.StartGame);
			openRooms.delete(roomId);
		});

		socket.on(SocketEvents.EndGame, ({ roomId }: { roomId: string }) => {
			console.log(`Room ${roomId} ended game`);
			io.to(roomId).emit(SocketEvents.EndGame);
		});

		socket.on(SocketEvents.AssignTurn, ({ roomId, userId }: { roomId: string; userId: string }) => {
			console.log(`Room ${roomId} assigned turn to ${userId}`);
			socket.to(roomId).emit(SocketEvents.AssignTurn, { userId });
		});

		socket.on(
			SocketEvents.SubmitAnswer,
			({ roomId, answer, name }: { roomId: string; answer: number, name: string }) => {
				console.log(`Room ${roomId} submitted answer ${answer}`);
				socket.to(roomId).emit(SocketEvents.SubmitAnswer, { answer, name });
			}
		);

		socket.on(
			SocketEvents.JoinTeam, ({ roomId, team }: { roomId: string; team: number }) => {
				const userId = socket.id;
				console.log(`Room ${roomId}: User ${userId} joined team ${team}`);
				socket.to(roomId).emit(SocketEvents.JoinTeam, { userId, team });
			}
		)

		socket.on('disconnect', () => {
			console.log(`Socket ${socket.id}  disconnected`);
		});
	});
}
