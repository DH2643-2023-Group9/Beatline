<script lang="ts">
	import { writable } from 'svelte/store';
	import Card from '../Card.svelte';

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

<div class="min-h-screen flex flex-col">
	<!-- Team Information -->
	<div class="flex justify-between p-4 position-fixed top-0 left-0 right-0">
		<!-- Team Red Information -->
		<div class="text-white bg-red-500 p-2 rounded">
			<h2>{teamRed.name}</h2>
			<p>Score: {teamRed.score}</p>
			<!-- Add more details as needed -->
		</div>

		<!-- Team Blue Information -->
		<div class="text-white bg-blue-500 p-2 rounded">
			<h2>{teamBlue.name}</h2>
			<p>Score: {teamBlue.score}</p>
			<!-- Add more details as needed -->
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
