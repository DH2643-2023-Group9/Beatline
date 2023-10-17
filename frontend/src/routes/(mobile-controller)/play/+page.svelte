<script lang="ts">
	import { getContext } from 'svelte';
	import type { MainContext } from '../+layout.svelte';
	import WaitingScreen from './WaitingScreen.svelte';
	import EndGame from './EndGame.svelte';
	import ControllerScreen from './ControllerScreen.svelte';

	const { socket, myName, isHost } = getContext<MainContext>('main');
    
    let gameStarted = false;
    let gameEnded = false;
	let myTurn = false;

	socket.on('startGame', () => {
		console.log('Game started!');
		gameStarted = true;
		gameEnded = false;
	});

	socket.on('submitAnswer', ({ answer, userId }) => {
		console.log('Answer submitted!');
		myTurn = false;
		console.log(myTurn);
		
	});

	socket.on('endGame', () => {
		console.log('Game ended!');
		gameEnded = true;
	});

	socket.on('error', ({error}) => {
		alert(error);
	});

	socket.on('assignTurn', ({ userId }) => {
		if (userId === socket.id) {
			console.log('My turn');
			myTurn = true;
		} else {
			myTurn = false;
		}
	});

	socket.on('backToLobby', () => {
		console.log('Back to lobby');
		gameStarted = false;
		gameEnded = false;
		myTurn = false;
	});
</script>

{#if gameEnded}
    <EndGame {socket} isHost={$isHost}/>
{:else if gameStarted}
    <ControllerScreen {socket} {myTurn} isHost={$isHost}/>
{:else}
    <WaitingScreen myName={$myName} isHost={$isHost} {socket}/>
{/if}