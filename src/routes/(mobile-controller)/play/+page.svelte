<script lang="ts">
	import { getContext } from 'svelte';
	import type { MainContext } from '../+layout.svelte';
	import WaitingScreen from './WaitingScreen.svelte';
	import EndGame from './EndGame.svelte';
	import ControllerScreen from './ControllerScreen.svelte';

	const { socket, myName } = getContext<MainContext>('main');
    
    let gameStarted = false;
    let gameEnded = false;
	let myTurn = false;

	socket.on('startGame', () => {
		console.log('Game started!');
		gameStarted = true;
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
</script>

{#if gameEnded}
    <EndGame {socket}/>
{:else if gameStarted}
    <ControllerScreen {socket} {myTurn}/>
{:else}
    <WaitingScreen myName={$myName}/>
{/if}