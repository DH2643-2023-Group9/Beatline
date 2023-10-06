<script lang="ts">
	interface Team {
		name: string;
		players: string[];
		score: number;
	}

	interface MessageHistory {
		sender: string;
		answer: number;
		actualYear: number;
	}

	import Card from '../Card.svelte';
	import { fly } from 'svelte/transition';
	export let gameCode: string | undefined;
	export let players: string[];
	export let messageHistory: MessageHistory[];
	export let currentTurnPlayer: string;
	export let currentTrack: TrackData;
	export let teamRed: Team;
	export let teamBlue: Team;
	import Profile from '../Profile.svelte';
	import type { TrackData } from '$lib/spotify';
	import TrackCard from './TrackCard.svelte';
	let minimized: boolean = false;
</script>

<div class="min-h-screen flex flex-col overflow-hidden">
	<div class="flex justify-center p-4 position-fixed top-0 left-0 right-0">
		<div class="text-black bg-yellow-300 p-2 rounded">
			<h2>It's {currentTurnPlayer}'s turn!</h2>
		</div>
		<TrackCard track={currentTrack} {minimized} />
	</div>
	<!-- Team Information -->
	<div class="flex justify-between p-4 position-fixed top-0 left-0 right-0 text-3xl text-center">
		<!-- Team Red Information -->
		<div class="rounded-md bg-gradient-to-r from-red-800 via-sky-200 to-red-600 p-1">
			<div class=" h-full w-full bg-gray-800">
				<h2>{teamRed.name}</h2>
				<p>Score: {teamRed.score}</p>

				<Profile extraClasses="mb-2 border-none">
					{#each teamRed.players as player}
						<div class="flex flex-wrap content-end">{player}</div>
					{/each}
				</Profile>
			</div>
		</div>

		<!-- Team Blue Information -->
		<div class="rounded-md bg-gradient-to-r from-blue-800 via-sky-200 to-cyan-600 p-1">
			<div class=" h-full w-full bg-gray-800">
				<h2>{teamBlue.name}</h2>
				<p>Score: {teamBlue.score}</p>

				<Profile extraClasses="mb-2 border-none">
					{#each teamBlue.players as player}
						<div class="flex flex-wrap content-end">{player}</div>
					{/each}
				</Profile>
			</div>
		</div>
	</div>

	<!-- Timeline -->
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
			{#each messageHistory as { sender, answer, actualYear }}
				<div
					in:fly={{ y: 300, duration: 1000 }}
					class="absolute -top-10 transform -translate-y-full"
					style="left: {((actualYear - 1950) / 70) * 100}%"
				>
					<div class="flex items-center">
						<div class="w-1 h-24 bg-gray-300 dark:bg-gray-700 rounded-full absolute top-0 mt-10" />
						<Card>
							<p>{sender} guessed {answer}.</p>
						</Card>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Interactivity -->
	<div class="fixed bottom-4 right-4">
		<!-- Button to add a new card -->
		<!-- Utilizing DaisyUI's predefined 'btn' component for a modern aesthetic. -->
	</div>
</div>

<style>
	/* Additional styling if needed beyond what's provided by Tailwind and DaisyUI. */
</style>
