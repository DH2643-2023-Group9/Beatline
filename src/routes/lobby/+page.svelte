<script lang="ts">
	import Game from './Game.svelte';
	import Lobby from './Lobby.svelte';
	import { io } from 'socket.io-client';
	import { page } from '$app/stores';

	const maxPlayers = parseInt($page.url.searchParams.get('maxPlayers') || '8');
	const socket = io();
	let gameCode: string | undefined;
	let players: string[] = [];
	let isGameStarted = false; // Added this state to manage the view to be displayed
	let messageHistory: string[] = [];
	let currentTurnIndex = 0;
	let currentTurnPlayer = "";

	function nextTurn() {
		currentTurnIndex = (currentTurnIndex + 1) % players.length;
		currentTurnPlayer = players[currentTurnIndex];
	}

	socket.on('createRoom', (roomId: string) => {
		gameCode = roomId;
	});

	socket.on('joinRoom', ({ userId, name }) => {
		players = [...players, name];
	});

	socket.emit('createRoom', maxPlayers);

	socket.on('submitAnswer', (data: { roomId: string; name: string; answer: string }) => {
		messageHistory = [...messageHistory, `${data.name}: ${data.answer}`];
		nextTurn();
		socket.emit('assignTurn', { roomId: gameCode, userId: currentTurnPlayer });
	});

	function startGame() {
		if (gameCode) {
			socket.emit('startGame', { roomId: gameCode });
			isGameStarted = true; // Update the state to true once the game starts
			console.log(currentTurnPlayer);
			currentTurnPlayer = players[currentTurnIndex];
			socket.emit('assignTurn', { roomId: gameCode, userId: currentTurnPlayer });
		}
	}
</script>


{#if isGameStarted}
	<Game {gameCode} {players} {messageHistory} {currentTurnPlayer} />
{:else}
	<Lobby {gameCode} {players} {startGame} />
{/if}
