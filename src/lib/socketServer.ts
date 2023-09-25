import type { ViteDevServer } from 'vite';
import { Server } from 'socket.io';

export enum SocketEvents {
	CreateRoom = 'createRoom',
	JoinRoom = 'joinRoom',
	StartGame = 'startGame',
	AssignTurn = 'assignTurn',
	UpdateAnswer = 'updateAnswer',
	SubmitAnswer = 'submitAnswer',
	Error = 'error'
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
			if (capacity === undefined) {
				socket.emit(SocketEvents.Error, { error: 'Room not found' });
				return;
			} else if (capacity === 0) {
				socket.emit(SocketEvents.Error, { error: 'Room is full' });
				return;
			}
			// TODO: This check can break if two people join at the same time
			console.log(`Socket ${socket.id} joined room ${roomId}`);
			openRooms.set(roomId, capacity - 1);
			socket.join(roomId);
			socket.to(roomId).emit(SocketEvents.JoinRoom, { userId: socket.id, name });
		});

		socket.on(SocketEvents.StartGame, (roomId: string) => {
			console.log(`Room ${roomId} started game`);
			openRooms.delete(roomId);
			socket.to(roomId).emit(SocketEvents.StartGame);
		});

		socket.on(SocketEvents.AssignTurn, (roomId: string, userId: string) => {
			console.log(`Room ${roomId} assigned turn to ${userId}`);
			socket.to(roomId).emit(SocketEvents.AssignTurn, userId);
		});

		socket.on(
			SocketEvents.SubmitAnswer,
			({ roomId, answer }: { roomId: string; answer: number }) => {
				console.log(`Room ${roomId} submitted answer ${answer}`);
				socket.to(roomId).emit(SocketEvents.SubmitAnswer, { userId: socket.id, answer });
			}
		);

		socket.on('disconnect', () => {
			console.log(`Socket ${socket.id}  disconnected`);
		});
	});
}
