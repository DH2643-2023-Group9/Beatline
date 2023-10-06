<script context="module" lang="ts">
	export type PlayerInfo = {
		name: string;
		id: string;
		team?: number;
	};
</script>


<script lang="ts">
	import GameView from './GameView.svelte';
	import Lobby from './Lobby.svelte';
	import { io } from 'socket.io-client';
	import { page } from '$app/stores';
	import PostGame from './PostGame.svelte';
	import { accessToken } from '$stores/tokenStore';
	import { goto } from '$app/navigation';
	import { GameModel, type Team, type Turn } from '$models/game';
	import { error } from '@sveltejs/kit';
	import type { TrackData } from '$lib/spotify';

	if (!$accessToken) throw error(401, 'Lacks access token');

	const maxPlayers = parseInt($page.url.searchParams.get('maxPlayers') || '8');
	const socket = io();
	let roomId: string | undefined;
	let players: PlayerInfo[] = [];
	let isGameStarted = false; // Added this state to manage the view to be displayed
	let isGameOver: boolean = false;
	const maxRounds = 2; // For example, 3 rounds. Adjust as needed.

	const gameModel = new GameModel([1950, 2020], maxRounds, 'rounds');
	let currentTurn: Turn | undefined;

	async function nextTurn() {
		if (!roomId) throw error(500, 'Game code is not defined');
		if (!$accessToken) throw error(500, 'Access token is not defined');
		currentTurn = await gameModel.getCurrentTurn($accessToken);
		console.log('currentTurn', currentTurn);
		socket.emit('assignTurn', { roomId: roomId, userId: currentTurn.player.id });
	}

	socket.on('createRoom', (id: string) => {
		roomId = id;
	});

	socket.on('joinRoom', ({ userId, name }) => {
		let team;
		if (gameModel.teams[0].players.length <= gameModel.teams[1].players.length) {
			team = 0;
		} else {
			team = 1;
		}
		gameModel.teams[team].players.push({ name, id: userId, abilities: [] });
		players = [...players, { name, id: userId, team }];
	});

	socket.emit('createRoom', maxPlayers);

	socket.on('submitAnswer', (data: { roomId: string; name: string; answer: number }) => {
		gameModel.submitGuess(data.answer);
		gameModel.advance();
		const winner = gameModel.getWinner();
		if (winner) {
			isGameStarted = false;
			isGameOver = true;
			socket.emit('endGame', { roomId });
		} else {
			nextTurn();
		}
	});

	async function startGame() {
		if (roomId) {

			socket.emit('startGame', { roomId });
			isGameStarted = true; // Update the state to true once the game starts
			await nextTurn();
		}
	}
</script>

{#if isGameStarted && currentTurn}
	<GameView
		timeline={currentTurn.team.timeline}
		currentPlayer={currentTurn.player}
		currentTrack={currentTurn.track}
		teams={gameModel.teams}
	/>
{:else if isGameOver}
	<!-- Post-game screen -->
	<PostGame teams={gameModel.teams} />
{:else}
	<Lobby gameCode={roomId} {players} {startGame} />
{/if}
