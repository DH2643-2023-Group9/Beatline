<script lang="ts">
	import type { Socket } from 'socket.io-client';
	import type { ClientToServerEvents, ServerToClientEvents } from '$shared/socketServer';

	export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	export let isHost: boolean;

	// You might want to include functions or actions that are to be performed when the game ends, for instance redirecting the user or letting them restart the game.
	function restartGame() {
		// Logic to restart the game or redirect to another page
		socket.emit('startGame')
	}

	function toLobby() {
		socket.emit('backToLobby')
	}
</script>

<div class="min-h-screen flex flex-col justify-center items-center p-4">
	<div class=" p-8 rounded-lg shadow-md text-center space-y-4">
		<h1 class="text-2xl font-semibold">Game Over</h1>
		<p class="text-gray-600">Thank you for playing!</p>
		<!-- TODO Fix so that restart actually works -->
		<!-- {#if isHost}
			<button class="btn btn-primary pointer-events-auto" on:click={restartGame}>Restart Game</button>
			<button class="btn btn-secondary pointer-events-auto" on:click={toLobby}>Back to Lobby</button>
		{:else}
			<p class="text-gray-600">Please wait for the host to restart the game.</p>
			<div class="loading loading-dots loading-xl"></div>
		{/if} -->
		
	</div>
</div>

<style>
	/* Additional styles can go here */
</style>
