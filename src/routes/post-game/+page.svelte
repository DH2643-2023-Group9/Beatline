<script lang="ts">
	let players = ['Player1', 'Player2', 'Player3'];
	let gameCode = 'ABC123';
	let gameLink = 'https://yourgame.com';
	let numPlayers = 3;
	let gameRounds = 5;
	import Card from '../Card.svelte';
	import { goto } from '$app/navigation';
	import Profile from '../Profile.svelte';

	function startGame() {
		//navigate to game
		goto('/game');
	};
	function goToLobby() {
		goto('/')
	}

	let lobbyName: string = '';
	let maxPlayers: number = 2;
	let loading: boolean = false;

	function createLobby() {
		//just make it so that loading is true for 2 seconds before making it false again
		loading = true;
		setTimeout(() => {
			loading = false;
			//navigate to lobby
			goto('/lobby');
		}, 2000);
	}
</script>

<div class="min-h-screen flex items-center justify-center text-white">
	<Card extraClasses=" p-8 rounded-xl shadow-lg w-96 space-y-6 ">


		{#if loading}
        <div class="flex justify-center w-full">
			<span class="loading loading-spinner loading-lg text-secondary" />
        </div>
		{:else}
			<button on:click={goToLobby} class="pointer-events-auto btn btn-info w-full text-white bg-gradient-to-r from-[#ffae00] via-[#EC407A] to-[#6200EA] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
				>Go back to Home Screen</button
			>
		{/if}

		{#if loading}
        <div class="flex justify-center w-full">
			<span class="loading loading-spinner loading-lg text-secondary" />
        </div>
		{:else}
			<button on:click={createLobby} class="pointer-events-auto btn btn-info w-full text-white bg-gradient-to-r from-[#ffae00] via-[#EC407A] to-[#6200EA] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
				>Restart Game with the same Settings</button
			>
		{/if}
	</Card>
</div>

<style>
	/* No additional styles required since DaisyUI takes care of it */
</style>
