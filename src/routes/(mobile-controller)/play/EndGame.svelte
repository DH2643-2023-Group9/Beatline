<script lang="ts">
	import type { Socket } from 'socket.io-client';
	import type { ClientToServerEvents, ServerToClientEvents } from '$lib/socketServer';

	export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

	// You might want to include functions or actions that are to be performed when the game ends, for instance redirecting the user or letting them restart the game.
	function restartGame() {
		// Logic to restart the game or redirect to another page
	}
</script>

<div class="min-h-screen flex flex-col justify-center items-center p-4">
	<div class=" p-8 rounded-lg shadow-md text-center space-y-4">
		<h1 class="text-2xl font-semibold">Game Over</h1>
		<p class="text-gray-600">Thank you for playing!</p>
		<button class="btn btn-primary" on:click={restartGame}>Restart Game</button>
	</div>
</div>

<style>
	/* Additional styles can go here */
</style>
