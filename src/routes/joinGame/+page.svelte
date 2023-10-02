<script lang="ts">
	import JoinGame from './JoinGame.svelte';
	import SendAnswer from './SendAnswer.svelte';
	import { io } from 'socket.io-client';

	const socket = io();

	let gameStarted = false;

	function startGame() {
		gameStarted = true;
	}

	function joinRoom(name: string, roomId: string) {
		if (!roomId || !name) {
			alert('Please enter a room ID and your name.');
			return;
		}
		socket.emit('joinRoom', { roomId, name });
	}

	socket.on('error', (data: { error: string }) => {
		alert(data.error);
	});

	socket.on('joinRoom', (data: { roomId: string; name: string }) => {
		// Handle successful join. Might update some UI or set some internal state.
		console.log(data);
	});

	socket.on('startGame', () => {
		console.log('Game started!');
		startGame();
	});
</script>

{#if !gameStarted}
	<JoinGame {socket} {startGame} {joinRoom} />

{:else}
	<SendAnswer {socket} />
{/if}
