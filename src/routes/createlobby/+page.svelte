<script lang="ts">
	import Card from "../Card.svelte";
	import { goto } from "$app/navigation";
	let lobbyName: string = '';
	let maxPlayers: number = 2;
	let loading: boolean = false;
	import Modal from '../Modal.svelte';
	let showModal = false;


	function createLobby() {
		//just make it so that loading is true for 2 seconds before making it false again
		loading = true;
		setTimeout(() => {
			loading = false;
			//navigate to lobby
			goto('/lobby?name=' + lobbyName + '&maxPlayers=' + maxPlayers);
		}, 2000);
	}

</script>

<button class="pointer-events-auto btn btn-info flex float-right" on:click={() => (showModal = true)}> How-to-play </button>

<Modal bind:showModal>
	<Card extraClasses="p-8  rounded-xl shadow-lg w-96 space-y-6 box-content border-[#6200EA]">
		<h1 class="text-centre box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-5xl">
			How do you play Beatline?
		</h1>
		<div>
			Only one person needs to 
		</div>
		<h2 class="text-2xl">
			Step 1. Create a lobby and connect your friends via their phones
		</h2>
		<div>
			After dividing yourselves into teams, press start on the website.
			Your goal is to accurately place the song being played, after 30 seconds the song stops and you're asked to input your answer

		</div>
		<div>
			yadda yadda vi skriver det här när vi vet exakt hur allt funkar
		</div>
	</Card>

</Modal>

<div class="min-h-screen flex items-center justify-center text-white">
	<Card extraClasses=" p-8 rounded-xl shadow-lg w-96 space-y-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
		<h1 class="text-xl font-bold text-center">Create a Lobby</h1>

		<div class="form-control">
			<label class="label" for="lobbyName">
				<span class="label-text font-thin text-white">Lobby Name</span>
			</label>
			<input
				bind:value={lobbyName}
				type="text"
				id="lobbyName"
				name="lobbyName"
				class="pointer-events-auto input input-bordered w-full text-[#232323]"
				placeholder="Enter lobby name"
				
				
			/>
		</div>

		<div class="form-control text-[232323]">
			<label class="label" for="maxPlayers">
				<span class="label-text font-thin text-white">Max Players</span>
			</label>
			<select
				bind:value={maxPlayers}
				id="maxPlayers"
				name="maxPlayers"
				class="pointer-events-auto select select-bordered w-full text-black"
			>
				<option value="2">2</option>
				<option value="4">4</option>
				<option value="6">6</option>
				<option value="8">8</option>
			</select>
		</div>
		{#if loading}
        <div class="flex justify-center w-full">
			<span class="loading loading-spinner loading-lg text-secondary" />
        </div>
		{:else}
			<button on:click={createLobby} class="pointer-events-auto btn btn-info w-full text-white bg-gradient-to-r from-[#ffae00] via-[#EC407A] to-[#6200EA] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
				>Create Lobby</button
			>
		{/if}
	</Card>
</div>

<style>
	/* No additional styles required since DaisyUI takes care of it */
</style>
