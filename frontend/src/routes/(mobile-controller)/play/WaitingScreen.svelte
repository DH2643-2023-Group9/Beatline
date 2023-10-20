<script lang="ts">
	export let myName: string; // Accept the player name as a prop
	export let isHost: boolean;
	export let startGame: () => void;
</script>

<!-- Main Content of the Waiting Screen -->
<div class="flex flex-col items-center justify-center h-screen p-4 md:p-8">
	<!-- Background color can be changed based on your preference -->

	<h1 class="text-2xl md:text-4xl mb-4">Welcome, {myName}!</h1>

	<div class="text-center">
		<p class="">You have successfully joined the game room.</p>
		<p class="">Waiting for the game to start...</p>

		<!-- Optional: You can add a spinner or any loading animation below -->
        <div class="loading loading-dots loading-xl"></div>
	</div>
	{#if isHost}
		<button class="btn btn-primary mt-4 pointer-events-auto" on:click={startGame}>Start Game</button>
	{/if}
</div>
