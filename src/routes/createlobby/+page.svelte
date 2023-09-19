<script lang="ts">
	import Card from "../Card.svelte";
	import { goto } from "$app/navigation";
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

<div class="min-h-screen flex items-center justify-center text-black">
	<Card extraClasses="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6">
		<h1 class="text-xl font-bold text-center">Create a Lobby</h1>

		<div class="form-control">
			<label class="label" for="lobbyName">
				<span class="label-text">Lobby Name</span>
			</label>
			<input
				bind:value={lobbyName}
				type="text"
				id="lobbyName"
				name="lobbyName"
				class="pointer-events-auto input input-bordered w-full"
				placeholder="Enter lobby name"
			/>
		</div>

		<div class="form-control">
			<label class="label" for="maxPlayers">
				<span class="label-text">Max Players</span>
			</label>
			<select
				bind:value={maxPlayers}
				id="maxPlayers"
				name="maxPlayers"
				class="pointer-events-auto select select-bordered w-full"
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
			<button on:click={createLobby} class="pointer-events-auto btn btn-info w-full"
				>Create Lobby</button
			>
		{/if}
	</Card>
</div>

<style>
	/* No additional styles required since DaisyUI takes care of it */
</style>
