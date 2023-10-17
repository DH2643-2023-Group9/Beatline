<script lang="ts">
	import { getContext } from 'svelte';
	import type { MainContext } from '../+layout.svelte';
	import { goto } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import { accessToken } from '$stores/tokenStore';
	const { socket, roomId, gameModel } = getContext<MainContext>('main');
	import Card from '../../Card.svelte';
	let loading: boolean = false;

	if (gameModel.isActive) {
		const msg = 'Game is currently active. Please wait for the game to end.';
		alert(msg);
		error(500, msg);
	}

	const teams = gameModel.getTeams();
	let winner: string;
	if (teams[0].score > teams[1].score) {
		winner = teams[0].name;
	} else if (teams[1].score > teams[0].score) {
		winner = teams[1].name;
	} else {
		winner = "It's a tie! 😐";
	}
	function startGame() {
		//navigate to game
		gameModel.reset();
		goto('/lobby');
	}

	function goToMain() {
		gameModel.reset();
		goto('/');
	}

	socket.on('startGame', () => {
		startGame();
	});

	socket.on('backToLobby', () => {
		gameModel.reset();
		goto('/lobby');
	});
</script>

<div
	class="min-h-screen flex items-center justify-center text-white min-w-1/2 text-2xl text-center"
>
	<Card extraClasses="rounded-xl">
		<div class="space-y-7">
			<h1 class="justify-center text-5xl">Post-Game</h1>

			<div class="text-4xl font-bold text-cyan-600">
				{#if winner !== "It's a tie! 😐"}
					Winner: {winner} 🎉
				{:else}
					{winner}
				{/if}
			</div>

			<!-- Team Red Score -->
			<div class="text-3xl font-semibold text-red-500 text-center">
				{teams[0].name} team's score: {teams[0].score}
			</div>

			<!-- Team Blue Score -->
			<div class="text-3xl font-semibold text-blue-500">
				{teams[1].name} team's score: {teams[1].score}
			</div>
		</div>

		<!-- svelte-ignore a11y-missing-attribute -->
		<ul class="menu menu-horizontal bg-transparent p-6 bg-[#303638]">
			<!-- TODO Fix so that restart actually works -->
			<!-- <li>
				<button
					on:click={startGame}
					class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:text-[#d4e157] hover:border-[#d4e157]"
					>Restart Game</button
				>
			</li>
			<li>
				<button
					on:click={startGame}
					class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:text-[#6200EA] hover:border-[#6200EA]"
					>Change Settings</button
				>
			</li> -->
				<button
					on:click={goToMain}
					class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:text-[#00bcd4] hover:border-[#00bcd4]"
					>Back to Menu</button
				>
		</ul>
	</Card>
</div>

<div class="flex flex-col items-center justify-center min-h-screen space-y-8">
	<!-- Winner Announcement -->
	<div class="text-3xl font-bold text-blue-600">
		{#if winner !== "It's a tie! 😐"}
			Winner: {winner} 🎉
		{:else}
			{winner}
		{/if}
	</div>

	<!-- Scoreboard -->
	<div class="flex space-x-8">
		<!-- Team Red Score -->
		<div class="flex flex-col items-center p-4 bg-slate-600 rounded-lg shadow-md space-y-4">
			<div class="text-xl font-semibold text-red-500">
				{teams[0].name}
			</div>
			<div class="text-2xl">
				Score: {teams[0].score}
			</div>
		</div>

		<!-- Team Blue Score -->
		<div class="flex flex-col items-center p-4 bg-slate-600 rounded-lg shadow-md space-y-4">
			<div class="text-xl font-semibold text-blue-500">
				{teams[1].name}
			</div>
			<div class="text-2xl">
				Score: {teams[1].score}
			</div>
		</div>
	</div>

	<!-- Restart Button -->
	<button class="btn btn-primary"> Back to Lobby </button>
</div>
