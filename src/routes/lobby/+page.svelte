<script lang="ts">
	import Game from './Game.svelte';
	import Lobby from './Lobby.svelte';
	import { io } from 'socket.io-client';
	import { page } from '$app/stores';

	interface Team {
		name: string;
		players: string[];
		score: number;
	}
	
	interface MessageHistory {
		sender: string;
		answer : number;
		actualYear : number;
	}

	const maxPlayers = parseInt($page.url.searchParams.get('maxPlayers') || '8');
	const socket = io();
	let gameCode: string | undefined;
	let players: string[] = [];
	let isGameStarted = false; // Added this state to manage the view to be displayed
	let messageHistory: MessageHistory[] = [];
	let currentTurnIndex: number = 0;
	let currentTurnPlayer: string = "";
	let currentTurnYear: number;

	let teamRed: Team = {
		name: 'Team Red',
		players: [],
		score: 0
	};

	let teamBlue: Team = {
		name: 'Team Blue',
		players: [],
		score: 0
	};

	function calculateScore(guessedYear: number, actualYear: number): number {
	// Determine the absolute difference
	const difference = Math.abs(guessedYear - actualYear);

	// Award points based on the difference
	if (difference === 0) {
		return 5;  // Exact guess
	} else if (difference <= 2) {
		return 4;  // Very close guess
	} else if (difference <= 5) {
		return 3;  // Close guess
	} else if (difference <= 10) {
		return 2;  // Off by a bit
	} else {
		return 1;  // Far off guess
	}
}

	function addToTeam(name: string): void {
		if (teamRed.players.length <= teamBlue.players.length) {
			teamRed.players.push(name);
		} else {
			teamBlue.players.push(name);
		}
	}

	function assignYear() {
		currentTurnYear = Math.floor(Math.random() * (2021 - 1950) + 1950);
	}

	function nextTurn() {
		currentTurnIndex = (currentTurnIndex + 1) % players.length;
		currentTurnPlayer = players[currentTurnIndex];
		assignYear();
	}

	socket.on('createRoom', (roomId: string) => {
		gameCode = roomId;
	});

	socket.on('joinRoom', ({ userId, name }) => {
		players = [...players, name];
		addToTeam(name);
	});

	socket.emit('createRoom', maxPlayers);

	socket.on('submitAnswer', (data: { roomId: string; name: string; answer: string }) => {
		messageHistory = [...messageHistory, { sender: data.name, answer: parseInt(data.answer), actualYear: currentTurnYear }];

			const score = calculateScore(parseInt(data.answer), currentTurnYear);
		if (teamRed.players.includes(data.name)) {
			teamRed.score += score;
		} else if (teamBlue.players.includes(data.name)) {
			teamBlue.score += score;
		}

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
			assignYear();
		}
	}
</script>


{#if isGameStarted}
	<Game {gameCode} {players} {messageHistory} {currentTurnPlayer} {currentTurnYear} {teamRed} {teamBlue} />
{:else}
	<Lobby {gameCode} {players} {startGame} />
{/if}
