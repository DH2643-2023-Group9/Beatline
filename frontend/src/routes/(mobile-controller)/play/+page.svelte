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
		gameStarted = true;
		gameEnded = false;
	});

	socket.on('submitAnswer', ({ answer, userId }) => {
		myTurn = false;
		
	});

	socket.on('endGame', () => {
		gameEnded = true;
	});

	socket.on('error', ({error}) => {
		alert(error);
	});

	socket.on('assignTurn', ({ userId }) => {
		if (userId === socket.id) {
			myTurn = true;
		} else {
			myTurn = false;
		}
	});

	socket.on('backToLobby', () => {
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