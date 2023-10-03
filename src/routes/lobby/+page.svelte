<script>
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
	}
</script>

<div class="min-h-screen flex flex-col">
	<!-- Add flex and flex-col to this container -->

	<!-- Content above the fixed div (stays at the top) -->
	<div class="position-fixed top-0 left-0 right-0 p-6 flex justify-between items-center">
		<div class="text-2xl font-bold">Your Game Logo</div>

		<div class="flex justify-center items-center">
			<!-- Game Code and Link -->
			<span class="mr-4">Game Code: {gameCode}</span>
			<span class="mr-4">Go to {gameLink} and enter the code to join</span>
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
					<h2 class="text-xl font-semibold mb-4 bg-[#">Players</h2>
						{#each players as player}
							<Profile extraClasses="mb-2">{player}</Profile>
						{/each}
					<button on:click={startGame} class="pointer-events-auto btn btn-info w-full text-white bg-gradient-to-r from-[#6200EA] via-[#EC407A] to-[#ffae00] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2	 "
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
							<label for="players" class="block text-sm font-medium"
								>Number of Players</label
							>
							<input
								id="players"
								type="number"
								bind:value={numPlayers}
								class="mt-1 block w-full rounded-md border-gray-300 bg-inherit"
							/>
						</div>
						<div>
							<label for="rounds" class="block text-sm font-medium"
								>Number of Rounds</label
							>
							<input
								id="rounds"
								type="number"
								bind:value={gameRounds}
								class="mt-1 block w-full rounded-md border-gray-300 bg-inherit"
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
