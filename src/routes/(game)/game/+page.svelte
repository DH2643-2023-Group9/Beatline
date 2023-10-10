<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import Card from '../../Card.svelte';
	import { fly } from 'svelte/transition';
	import Profile from '../../Profile.svelte';
	import TrackCard from './TrackCard.svelte';
	import type { Team, Turn } from '$models/game';
	import { accessToken } from '$stores/tokenStore';
	import { error } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import type { MainContext } from '../+layout.svelte';
	if (!$accessToken) throw error(401, 'Lacks access token');
	let currentTurn: Turn | undefined;

	const { socket, gameModel } = getContext<MainContext>('main');

	// The user went to the `/game` page before starting a game.
	// Send them to the lobby.
	if (!gameModel.isActive) goto('/lobby');
	let teams: Team[] = gameModel.getTeams();

	if (!$accessToken) goto('/');

	async function nextTurn() {
		if (!$accessToken) throw error(500, 'Access token is not defined');
		currentTurn = await gameModel.getCurrentTurn($accessToken);
		teams = gameModel.getTeams();
		console.log('currentTurn', currentTurn);
		socket.emit('assignTurn', { userId: currentTurn.player.id });
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
			gameModel.isActive = false;
			socket.emit('endGame');
			goto('/postGame');
		} else {
			nextTurn();
		}
	});

	onMount(async () => {
		await nextTurn();
	});
</script>

{#if currentTurn}
	<div class="min-h-screen flex flex-col overflow-hidden">
		<div class="text-white text-center text-4xl p-2 rounded">
			<h2>It's {currentTurn.player.name}'s turn!</h2>
		</div>

		<div class="flex justify-center p-4 position-fixed top-0 left-0 right-0">
			<TrackCard extraClasses="w-1/6 h-1/5" track={currentTurn.track} minimized={false} />
		</div>
		<!-- Team Information -->
		<div class="flex justify-between p-4 position-fixed top-0 left-0 right-0 text-3xl text-center">
			<!-- Team Red Information -->
			<div class="rounded-md bg-gradient-to-r from-red-800 via-sky-200 to-red-600 p-1 space-x-6 space-y-6">
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
			<div class="rounded-md bg-gradient-to-r from-blue-800 via-sky-200 to-cyan-600 p-1 space-x-6 space-y-6">
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

		<!-- Timeline -->
		<div class="flex-grow flex items-center justify-center p-4">
			<div class="relative w-3/4 h-full mx-auto">
				<!-- Adjusted the width to 3/4 and centered it -->
				<!-- Timeline representation -->
				<div class="absolute top-1/2 left-0 w-full h-1 bg-gray-300" />

				<!-- Year Markers -->
				{#each Array(8) as _, i}
					<!-- Change from 7 to 8 to include 2020 -->
					<div
						class="absolute top-1/2 transform -translate-y-1/2 text-center"
						style="left: {(i / 7) * 100}%"
					>
						<!-- Display the year above the marker -->
						<div class="absolute bottom-full mb-1 text-sm text-gray-700">{1950 + i * 10}</div>

						<!-- Marker for the year -->
						<div class="w-1 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
					</div>
				{/each}

				<!-- Cards on the timeline -->
				{#each teams as team}
					{#each team.timeline as { player, guessedYear, track }}
						<div
							class="absolute -top-10 transform -translate-y-full"
							style="left: {((track.year - 1950) / 70) * 100}%"
						>
							<div class="flex items-center">
								<div
									class="w-1 h-24 bg-gray-300 dark:bg-gray-700 rounded-full absolute top-0 mt-10"
								/>
								<TrackCard extraClasses='w-40' minimized={true} track={track}>
									<p>{player.name} guessed {guessedYear}.</p>
								</TrackCard>
							</div>
						</div>
					{/each}
				{/each}
			</div>
		</div>

		<!-- Interactivity -->
		<div class="fixed bottom-4 right-4">
			<!-- Button to add a new card -->
			<!-- Utilizing DaisyUI's predefined 'btn' component for a modern aesthetic. -->
		</div>
	</div>
{:else}
	<div class="flex justify-center w-full h-full">
		<span class="loading loading-spinner loading-lg text-secondary" />
	</div>
{/if}

<style>
	/* Additional styling if needed beyond what's provided by Tailwind and DaisyUI. */
</style>
