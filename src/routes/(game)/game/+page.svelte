<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import Card from '../../Card.svelte';
	import { fly } from 'svelte/transition';
	import Profile from '../../Profile.svelte';
	import TrackCard from './TrackCard.svelte';
	import NoFlipCard from './NoFlipCard.svelte';
	import type { Team, Turn } from '$models/game';
	import { accessToken } from '$stores/tokenStore';
	import { error } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import type { MainContext } from '../+layout.svelte';
	import TimelineFlip from './TimelineFlip.svelte';
	if (!$accessToken) throw error(401, 'Lacks access token');
	let currentTurn: Turn | undefined;
	let currentTeam: number = 0;
	let gameOver: boolean = false;

	const { socket, gameModel } = getContext<MainContext>('main');

	// The user went to the `/game` page before starting a game.
	// Send them to the lobby.
	if (!gameModel.isActive) goto('/lobby');
	let teams: Team[] = gameModel.getTeams();

	if (!$accessToken) goto('/');

	async function nextTurn() {
		if (!$accessToken) throw error(500, 'Access token is not defined');
		currentTurn = await gameModel.getCurrentTurn($accessToken);
		console.log('currentTurn', currentTurn.turn);
		currentTeam = (currentTeam + 1) % 2;
		teams = gameModel.getTeams();
		console.log('currentTurn', currentTurn);
		setTimeout(() => {
			if (currentTurn) socket.emit('assignTurn', { userId: currentTurn.player.id });
		}, 6000);
	}
	async function showLastCard() {
		gameOver = true;
		if (!$accessToken) throw error(500, 'Access token is not defined');
		currentTurn = await gameModel.getCurrentTurn($accessToken);
	}

	socket.on('submitAnswer', ({ answer, userId }) => {
		if (currentTurn && userId !== currentTurn.player.id) {
			console.log(`Recieved answer from user ${userId} but it's ${currentTurn.player.id}'s turn!`);
			socket.emit('error', { error: 'It is not your turn!!!' });
			return;
		}
		gameModel.submitGuess(answer);
		gameModel.advance();
		const winner = gameModel.getWinner();
		if (winner) {
			showLastCard();
			setTimeout(() => {
				gameModel.isActive = false;
				socket.emit('endGame');
				goto('/postGame');
			}, 3000);
		} else {
			nextTurn();
		}
	});

	onMount(async () => {
		if ($accessToken === undefined) throw error(500, 'Access token is not defined');
		await gameModel.populateTimelines($accessToken);
		await nextTurn();
	});
</script>

{#if currentTurn}
	<div class="min-h-screen flex flex-col justify-between">
		<div class="text-white text-center text-4xl p-2 rounded">
			{#if gameOver}
				<h1>Game Over!</h1>
			{:else}
				<h2>It's {currentTurn.player.name}'s turn!</h2>
			{/if}
			<TrackCard
				extraClasses="w-1/6 h-1/5"
				track={currentTurn.track}
				minimized={false}
				playFor10Seconds={true}
			/>
		</div>

		<!-- Team Information -->
		<div class="flex justify-between p-4 fixed top-0 left-0 right-0 text-3xl text-center">
			<!-- Team Red Information -->
			<div
				class="rounded-md bg-gradient-to-r from-red-800 via-sky-200 to-red-600 p-1 space-x-6 space-y-6"
			>
				<div class=" h-full w-full bg-gray-800">
					<h2>{teams[0].name}</h2>
					<p>Score: {teams[0].score}</p>

					<Profile extraClasses="mb-2 border-none">
						{#each teams[0].players as player}
							<div class="flex flex-wrap content-end">{player.name}</div>
						{/each}
					</Profile>
				</div>
			</div>

			<!-- Team Blue Information -->
			<div
				class="rounded-md bg-gradient-to-r from-blue-800 via-sky-200 to-cyan-600 p-1 space-x-6 space-y-6"
			>
				<div class=" h-full w-full bg-gray-800">
					<h2>{teams[1].name}</h2>
					<p>Score: {teams[1].score}</p>

					<Profile extraClasses="mb-2 border-none">
						{#each teams[1].players as player}
							<div class="flex flex-wrap content-end">{player.name}</div>
						{/each}
					</Profile>
				</div>
			</div>
		</div>

		<TimelineFlip {teams} {currentTeam} />
	</div>
{:else}
	<div class="flex justify-center w-full h-full">
		<span class="loading loading-spinner loading-lg text-secondary" />
	</div>
{/if}

<style>
	/* Additional styling if needed beyond what's provided by Tailwind and DaisyUI. */
</style>
