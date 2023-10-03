<script lang="ts">
	import { writable } from 'svelte/store';
	import Card from '../Card.svelte';
	import Profile from '../Profile.svelte'
	let redPlayer = ['Player1', '	Player2', '	Player3'];
	let bluePlayer = ['Player1', '	Player2', '	Player3'];


	// Define the cards store
	const cards = writable<Card[]>([]);

	let teamRed = {
		name: 'Team Red',
		score: 10
	};

	let teamBlue = {
		name: 'Team Blue',
		score: 8
	};
	interface Card {
  text: string;
}

	function addCard() {
		// Use the update method of the writable store to push new card data
		cards.update((currentCards: Card[]) => {
			return [
				...currentCards,
				{
					text: 'Sample text'
				}
			];
		});
	}
</script>

<div class="min-h-screen min-w-fit flex flex-col">
	<!-- Team Information -->
	<div class="flex justify-between p-4 position-fixed top-0 left-0 right-0 text-3xl text-center">
		<!-- Team Red Information -->
		<div class="rounded-md bg-gradient-to-r from-red-800 via-sky-200 to-red-600 p-1 w-1/4">
			<div class=" h-full w-full bg-gray-800 space-y-4">		
			<h2>{teamRed.name}</h2>
			<p>Score: {teamRed.score}</p>

			<div class="flex flex-wrap content-end justify-center text-xl "> {redPlayer}</div>

	</div>
	</div>
		
		<!-- Team Blue Information -->
		<div class="rounded-md bg-gradient-to-r from-blue-800 w-1/4 via-sky-200 to-cyan-600 p-1 w-1/4 ">
			<div class=" h-full w-full bg-gray-800 space-y-4">		
			<h2>{teamBlue.name}</h2>
			<p>Score: {teamBlue.score}</p>

			<div class="flex flex-wrap content-end justify-center text-xl "> {bluePlayer}</div>
		</div>
	</div>
		
	</div>

	<!-- Timeline -->
	<div class="flex-grow flex items-center justify-center">
			<div class="flex space-x-4 overflow-x-auto p-4">
				<!-- Cards on the timeline -->
				{#each $cards as card}
					<Card>
						<p>{card.text}</p>
					</Card>
				{/each}
			</div>
	</div>

	<!-- Interactivity -->
	<div class="fixed bottom-4 right-4">
		<!-- Button to add a new card -->
		<button class="btn btn-primary pointer-events-auto" on:click={addCard}>Add Card</button>
		<!-- Utilizing DaisyUI's predefined 'btn' component for a modern aesthetic. -->
	</div>
</div>

<style>
	/* Additional styling if needed beyond what's provided by Tailwind and DaisyUI. */
</style>
