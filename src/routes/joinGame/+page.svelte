<script lang="ts">
	import JoinGame from './JoinGame.svelte';
	import SendAnswer from './SendAnswer.svelte';
	import { io } from 'socket.io-client';

	const socket = io();

	let gameStarted = false;
	let roomIdVariable = "";
	let nameVariable = "";
	let myTurn = false;

	function startGame() {
		gameStarted = true;
	}

	function joinRoom(name: string, roomId: string) {
		if (!roomId || !name) {
			alert('Please enter a room ID and your name.');
			return;
		}
		roomIdVariable = roomId;
		nameVariable = name;
		socket.emit('joinRoom', { roomId, name });
	}
	function setMyTurn( bool: boolean) {
		myTurn = bool;
	}

	

	socket.on('startGame', () => {
		console.log('Game started!');
		startGame();
	});

	socket.on('error', (data: { error: string }) => {
		alert(data.error);
	});

	socket.on('joinRoom', (data: { roomId: string; name: string }) => {
		// Handle successful join. Might update some UI or set some internal state.
		console.log(data);
	});
	socket.on('assignTurn', (data: { userId: string }) => {
		console.log(nameVariable);
		console.log(data.userId);
		if (data.userId === nameVariable) {
			console.log('my turn');
			setMyTurn(true);
		} else {
			setMyTurn(false);
		}
		console.log(data);
	});
</script>

{#if !gameStarted}
	<JoinGame {socket} {startGame} {joinRoom} />

{:else}
	<SendAnswer {socket} {roomIdVariable} {nameVariable} {myTurn} {setMyTurn} />
{/if}
