<script lang="ts">
	import EndGame from './EndGame.svelte';
import JoinGame from './JoinGame.svelte';
	import SendAnswer from './SendAnswer.svelte';
	import WaitingScreen from './WaitingScreen.svelte';
	import { io } from 'socket.io-client';

	const socket = io();

	let gameStarted = false;
	let gameEnded = false;
	let roomIdVariable = "";
	let nameVariable = "";
	let myTurn = false;
	let joined = false;  // Add this line for the joined state

	function startGame() {
		gameStarted = true;
	}
	function endGame() {
		gameEnded = true;
	}

	function joinRoom(name: string, roomId: string) {
		if (!roomId || !name) {
			alert('Please enter a room ID and your name.');
			return;
		}
		roomIdVariable = roomId;
		nameVariable = name;
		socket.emit('joinRoom', { roomId, name });
		joined = true;  // Set joined to true when the user joins a room
	}

	function setMyTurn( bool: boolean) {
		myTurn = bool;
	}

	socket.on('startGame', () => {
		console.log('Game started!');
		startGame();
	});

	socket.on('endGame', () => {
		console.log('Game ended!');
		endGame();
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
		if (data.userId === socket.id) {
			console.log('my turn');
			setMyTurn(true);
		} else {
			setMyTurn(false);
		}
		console.log(data);
	});

</script>


{#if !gameStarted}
    {#if !joined}
        <JoinGame {socket} {startGame} {joinRoom} />
    {:else}
        <WaitingScreen playerName={nameVariable} />
    {/if}
{:else}
	{#if !gameEnded}
    <SendAnswer {socket} {roomIdVariable} {nameVariable} {myTurn} {setMyTurn} />
	{:else}
	<EndGame  />
	{/if}
{/if}

