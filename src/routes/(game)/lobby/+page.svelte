<script lang="ts">
	import { getContext } from 'svelte';
	import type { MainContext, PlayerInfo } from '../+layout.svelte';
	import { goto } from '$app/navigation';
	import Card from '../../Card.svelte';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { LimitType } from '$models/game';
	import { error } from '@sveltejs/kit';

	const { socket, roomId, gameModel } = getContext<MainContext>('main');

	if (gameModel.isActive) {
		const msg = 'You dun goofed. The game is already start';
		alert(msg);
		error(500, msg);
	}

	const joinURL = `${PUBLIC_BASE_URL}/joinGame`;
	let maxPlayers = 5;
	let limit = gameModel.limit;
	let limitType: LimitType = gameModel.limitType;
	let players: PlayerInfo[] = gameModel.getAllPlayerInfo();
	let copied = false;
	let interval = [1950, 2023];
	let autoAssign = true;

	socket.on('createRoom', (data) => {
		roomId.set(data.roomId);
	});

	socket.on('joinRoom', ({ name, userId }) => {
		console.log('In `joinRoom`, userId=', userId);
		players = [...players, { name, id: userId, host: players.length === 0 }];
	});

	socket.on('joinTeam', ({ team, userId }) => {
		players = players.map((player) => {
			if (player.id === userId) {
				return { ...player, team };
			}
			return player;
		});
	});

	function startGame() {
		if (players.length < 2) {
			alert('You need at least 2 players to start the game');
			return;
		}
		if (!autoAssign && gameModel.teams.some((t) => t.players.length < 1)) {
			alert('You need at least 1 players per team to start the game');
			return;
		}
		gameModel.interval = interval;
		gameModel.setLimit(limit, limitType);
		const teams = gameModel.teams;
		players.forEach((p) => {
			console.log('Adding player', p);
			if (autoAssign) {
				p.team = teams[0].players.length <= teams[1].players.length ? 0 : 1;
			}
			if (p.team === undefined) {
				alert(`Player ${p.name} is not assigned to a team`);
				return;
			}
			gameModel.addToTeam(p.team || 0, { ...p, abilities: [] });
		});
		gameModel.isActive = true;
		socket.emit('startGame');
		goto('/game');
	}

	async function copyGameCode() {
		try {
			await navigator.clipboard.writeText($roomId || '');
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	}

	socket.emit('createRoom', { capacity: maxPlayers, roomId: $roomId });
</script>

<div class="min-h-screen flex flex-col">
	<!-- Add flex and flex-col to this container -->

	<!-- Content above the fixed div (stays at the top) -->
	<div class="position-fixed top-0 left-0 right-0 p-6 flex justify-between items-center">
		<div class="text-2xl font-bold">Your Game Logo</div>

		<div class="flex justify-center items-center">
			<!-- Game Code and Link -->
			<span class="mr-4 pointer-events-auto" on:click={copyGameCode}>
				Game Code: {$roomId}
				{#if copied}<span class="text-green-500">(Copied!)</span>{/if}
			</span>
			<span class="mr-4">Go to <a href={joinURL}>{joinURL}</a> and enter the code to join</span>
		</div>
	</div>

	<!-- Center the content vertically -->
	<div class="flex-grow flex items-center justify-center">
		<div class="flex justify-center items-start w-full">
			<!-- Added w-full and items-start -->

			<!-- Left Side (Players List) -->
			<div class="w-1/3 flex flex-col justify-between p-6">
				<!-- Logo -->
				<Card>
					<h2 class="text-xl font-semibold mb-4">Players</h2>
					<ul>
						{#each players as player}
							<li class="mb-2">{player.name}</li>
						{/each}
					</ul>
					<button on:click={startGame} class="pointer-events-auto btn btn-info w-full mt-4"
						>Start Game</button
					>
				</Card>
			</div>

			<!-- Right Side (Settings) -->
			<div class="w-2/3 flex flex-col justify-between p-6">
				<!-- Settings -->
				<Card>
					<h3 class="text-lg font-semibold mb-4">Settings</h3>
					<div class="space-y-4">
						<div>
							<label for="players" class="block text-sm font-medium text-gray-700"
								>Number of Players</label
							>
							<input
								id="players"
								type="number"
								bind:value={players.length}
								class="mt-1 block w-full rounded-md border-gray-300"
							/>
						</div>
						<div>
							<label for="rounds" class="block text-sm font-medium text-gray-700"
								>Number of Rounds</label
							>
							<input
								id="limit"
								type="number"
								bind:value={limit}
								class="mt-1 block w-full rounded-md border-gray-300 pointer-events-auto"
							/>
						</div>
					</div>
				</Card>
			</div>
		</div>
	</div>

	<!-- Other content below the flex container -->
	<!-- ... your other content ... -->
</div>

<style>
	/* You can add any additional styles or override default Tailwind styles here */
</style>
