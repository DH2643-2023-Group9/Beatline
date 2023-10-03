<script lang="ts">
	export let gameCode: string | undefined;
	export let players: string[];
    export let startGame: () => void;

	import Card from '../Card.svelte';
	import { goto } from '$app/navigation';

	let numPlayers: number = 0;
	let gameRounds: number = 5;
	let copied = false;

	async function copyGameCode() {
		try {
			await navigator.clipboard.writeText(gameCode || "");
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	}
</script>
<div class="min-h-screen flex flex-col">
	<!-- Add flex and flex-col to this container -->

	<!-- Content above the fixed div (stays at the top) -->
	<div class="position-fixed top-0 left-0 right-0 p-6 flex justify-between items-center">
		<div class="text-2xl font-bold">Your Game Logo</div>

		<div class="flex justify-center items-center">
			<!-- Game Code and Link -->
			<span class="mr-4 pointer-events-auto" on:click={copyGameCode}>
				Game Code: {gameCode} {#if copied}<span class="text-green-500">(Copied!)</span>{/if}
			</span>
			<span class="mr-4">Go to hmm and enter the code to join</span>
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
							<li class="mb-2">{player}</li>
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
								id="rounds"
								type="number"
								bind:value={gameRounds}
								class="mt-1 block w-full rounded-md border-gray-300"
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
