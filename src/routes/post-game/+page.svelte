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

<div class="min-h-screen flex items-center justify-center text-white ">
	<Card extraClasses=" p-8 rounded-xl shadow-lg w-96 space-y-6 flex items-center flex-1">

		<h1 class="justify-center text-xl">
			Post-Game
			
		</h1>
	 <!-- svelte-ignore a11y-missing-attribute -->
	 <ul class="menu menu-horizontal bg-base-200 bg-[#303638] ">
		<li><button on:click={startGame} class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg 
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:border-[#6200EA]">Restart Game</button></li>
		<li><button on:click={createLobby} class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg 
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:border-[#6200EA]">Restart Game</button></li>
		<li><button on:click={goToMain} class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
			 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg 
			 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:border-[#6200EA]">Restart Game</button></li>
	  </ul>
	  
		  

	</Card>
</div>

<style>
	/* No additional styles required since DaisyUI takes care of it */
</style>
