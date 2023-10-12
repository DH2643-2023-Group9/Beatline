<script lang="ts">
	import { getContext } from 'svelte';
	import type { MainContext } from '../+layout.svelte';
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

	const joinURL = `${PUBLIC_BASE_URL}/join`;
	let teams = gameModel.teams;
	let maxPlayers = 5;
	let limit = gameModel.limit;
	let limitType: LimitType = gameModel.limitType;
	let copied = false;
	let interval = [1950, 2023];
	let maxScore = 20;

	socket.on('createRoom', (data) => {
		$roomId = data.roomId;
	});

	socket.on('joinRoom', ({ name, userId }) => {
		console.log('In `joinRoom`, userId=', userId);
		gameModel.addPlayer({
			name,
			id: userId,
			host: gameModel.numberOfPlayers() === 0,
			abilities: []
		});
		teams = gameModel.teams;
	});

	socket.on('joinTeam', ({ team, userId }) => {
		console.log(`User ${userId} joined team ${team}`);
		gameModel.switchTeam(userId, team);
		teams = gameModel.teams;
	});

	function startGame() {
		if (gameModel.teams.map((t) => t.players.length).some((n) => n < 1)) {
			alert('You need at least 2 players to start the game');
			return;
		}
		gameModel.interval = interval;
		gameModel.setLimit(limit, limitType);
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
	<div class="position-fixed top-0 left-0 right-0 p-6 flex justify-between">
		<div class="text-2xl font-bold">Your Game Logo</div>

		<div class="flex justify-center items-center text-xl">
			<!-- Game Code and Link -->
			Copy
			<a class="pointer-events-auto text-purple-400 mr-1 ml-1" href={joinURL + `?roomId=${$roomId}`}
				>this</a
			>
			link, or go to
			<a class="pointer-events-auto text-purple-400 mr-1 ml-1" href={joinURL}>{joinURL}</a>
			and enter code
			<span
				class="pointer-events-auto cursor-pointer text-purple-400 ml-1"
				role="mark"
				on:click={copyGameCode}
			>
				{$roomId}
			</span>
			{#if copied}<span class="text-green-500 mr-1 ml-1">(Copied!)</span>{/if}.
		</div>
	</div>

	<!-- Center the content vertically -->
	<div class="flex-grow flex items-center justify-center">
		<!-- Added w-full and items-start -->
		<div class="flex justify-center items-start">
			<!-- Left Side (Players List) -->
			<div class="w-1/3 flex p-6">
				<!-- Logo -->
				<Card extraClasses="min-w-[300px]">
					{#each teams as {players, name}}
						<div>
							<h2 class="text-xl font-semibold mb-4">{name}</h2>
							{#each players as player}
								<li class="mb-2">{player.name}</li>
							{/each}
						</div>
					{/each}
					<button
						on:click={startGame}
						class="pointer-events-auto btn btn-info w-full text-white bg-gradient-to-r from-[#6200EA] via-[#EC407A] to-[#ffae00] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>Start Game</button
					>
				</Card>
			</div>

			<!-- Right Side (Settings) -->
			<div class="w-2/3 flex p-6">
				<!-- Settings -->
				<Card extraClasses="min-w-[700px]">
					<h3 class="text-lg font-semibold mb-4">Settings</h3>
					<div class="space-y-4">
						<div>
							<label for="players" class="block text-sm font-medium">Number of Players</label>
							<input
								id="players"
								type="number"
								bind:value={maxPlayers}
								class="mt-1 block w-full rounded-md border-gray-300 bg-inherit"
							/>
						</div>

						<!-- 
							<div class="pointer-events-auto dropdown">
							<label tabindex="0" class="btn m-1">Game Settings</label>
							<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 text-black rounded-box w-52">
							  <li><a>Play by rounds</a></li>
							  <li><a>Play by score</a></li>
							</ul>
						  </div>
						-->

						<div>
							<label for="players" class="block text-lg font-bold"> Game Settings: </label>
							<span class="flex items-center justify-evenly">
								<input
									type="radio"
									name="radio-1"
									class="pointer-events-auto radio radio-secondary"
									checked
								/>
								<input
									type="radio"
									name="radio-1"
									class="pointer-events-auto radio radio-secondary"
								/>
							</span>
							<span class="flex items-center justify-evenly">
								<label for="radio-1" class="block text-sm font-medium">By rounds</label>
								<label for="radio-1" class="block text-sm font-medium">By score</label>
							</span>
						</div>

						<div>
							<label for="players" class="block text-sm font-medium"> Number of Rounds </label>
							<input
								type="range"
								class="pointer-events-auto range range-secondary bg-neutral"
								min="6"
								max="12"
								step="2"
								bind:value={limit}
							/>
							<div class="w-full flex justify-between text-xs px-2">
								<span>6</span>
								<span>8</span>
								<span>10</span>
								<span>12</span>
							</div>
						</div>

						<div>
							<label for="players" class="block text-sm font-medium"> Max Score </label>
							<input
								type="range"
								class="pointer-events-auto range range-secondary bg-neutral"
								min="5"
								max="20"
								step="5"
								bind:value={maxScore}
							/>
							<div class="w-full flex justify-between text-xs px-2">
								<span>5</span>
								<span>10</span>
								<span>15</span>
								<span>20</span>
							</div>
						</div>

						<div>
							<label for="players" class="block text-sm font-medium"> Difficulty </label>
							<input
								type="radio"
								name="radio-2"
								class="pointer-events-auto radio radio-secondary"
								checked
							/>
							<input
								type="radio"
								name="radio-2"
								class="pointer-events-auto radio radio-secondary"
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
