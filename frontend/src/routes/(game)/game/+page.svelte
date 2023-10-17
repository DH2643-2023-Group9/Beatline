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
	import TeamInfo from './TeamInfo.svelte';
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
		currentTeam = (currentTeam + 1) % 2;
		teams = gameModel.getTeams();
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
			<TeamInfo team={teams[0]} gradientColors={['red-800', 'sky-200', 'red-600']} />

			<!-- Team Blue Information -->
			<TeamInfo team={teams[1]} gradientColors={['blue-800', 'sky-200', 'cyan-600']} />
		</div>

		<TimelineFlip {teams} {currentTeam} />
	</div>
{:else}
	<div class="flex w-full h-full justify-center items-center min-h-screen">
		<span class="loading loading-spinner loading-lg text-secondary" />
	</div>
{/if}

<style>
	/* Additional styling if needed beyond what's provided by Tailwind and DaisyUI. */
</style>
