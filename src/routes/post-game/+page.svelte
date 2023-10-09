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

	function goToMain() {
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
	<Card extraClasses="rounded-xl shadow-lg space-y-6 flex items-center">

		<h1 class="justify-center text-xl">
			Post-Game
		</h1>

		<div>
			 Winner - Team 1
		</div>

		<div>
			player1a, player2b
		</div>

		<div>
			Bästa gissning: Player1b 1982
		</div>

	 <!-- svelte-ignore a11y-missing-attribute -->
	 <ul class="justify-center menu-horizontal bg-[#303638] bg-transparent space-x-10">
		<li><button on:click={startGame} class="pointer-events-auto btn btn-info text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 hover:text-white dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg 
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:border-[#6200EA]">Restart Game</button></li>
		<li><button on:click={createLobby} class="pointer-events-auto btn btn-info text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 hover:text-white shadow-lg shadow-pink-500/50 dark:shadow-lg 
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:border-[#6200EA]">Change Settings</button></li>
		<li><button on:click={goToMain} class="pointer-events-auto btn btn-info text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 hover:text-white dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg 
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:border-[#6200EA]">Quit</button></li>
	  </ul>
	  
	  
	</Card>
</div>

<style>
	/* No additional styles required since DaisyUI takes care of it */
</style>
