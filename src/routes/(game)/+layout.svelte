<script context="module" lang="ts">
	export type PlayerInfo = {
		name: string;
		id: string;
		team?: number;
		host: boolean;
	};
	export type MainContext = {
		socket: Socket<ServerToClientEvents, ClientToServerEvents>;
		roomId: Writable<string>;
		gameModel: GameModel;
	};
	
</script>


<script lang="ts">
    import { setContext } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
	import { Socket, io } from 'socket.io-client';
	import { randomRoomId } from '$lib/misc';
	import { GameModel } from '$models/game';
	import type { ClientToServerEvents, ServerToClientEvents } from '$lib/socketServer';


	setContext<MainContext>('main', {
		socket: io(),
		roomId: writable<string>(randomRoomId()),
		gameModel: GameModel.initDefault(),
	})

</script>

<slot>

	<div class="min-h-screen flex items-center justify-center text-white min-w-1/2 text-2xl text-center">
		<Card extraClasses="">
			<div class="space-y-7">
				<h1 class="justify-center text-5xl">
					Post-Game
				</h1>
				<div>
					hej här kommer lite statistik från spelen
				</div>
	
				<div> jonas vann! med poäng</div>
	
				<div> och det är rätt coolt!</div>
	
				<div> det här är personen med bäst gissningar! </div>
			</div>
	
		 <!-- svelte-ignore a11y-missing-attribute -->
		 <ul class="menu menu-horizontal bg-transparent justify-between p-6 bg-[#303638] ">
			<li><button on:click={startGame} class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
				 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg 
				 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:border-[#6200EA]">Restart Game</button></li>
			<li><button on:click={createLobby} class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
				 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg 
				 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:border-[#6200EA]">Change Settings</button></li>
			<li><button on:click={goToMain} class="pointer-events-auto btn btn-info w-full text-white bg-[#303638] border-[#303638]
				 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg 
				 dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:border-[#6200EA]">Back to Menu</button></li>
		  </ul>
		  
			  
		</Card>
	</div>
	
	

</slot>
