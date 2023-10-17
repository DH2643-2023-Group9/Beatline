<script>
	import { accessToken } from '$stores/tokenStore';
	let dropdownOpen = false;
	import Modal from './Modal.svelte';
	let showModal = false;

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}
</script>

<div class="background relative">
	<!-- Headline above the button -->
	<img src={'beatlinepng.png'} alt="Beatline" class="w-1/3 h-auto" />

	<button
		class="pointer-events-auto btn btn-wide btn-accent m-1 transform transition-transform hover:scale-105 mb-4"
		on:click={() => (showModal = true)}
	>
		How to Play
	</button>

	<Modal bind:showModal />

	{#if !$accessToken}
		<a
			data-sveltekit-preload-data="tap"
			class="btn btn-wide btn-warning m-1 pointer-events-auto transform transition-transform hover:scale-105 hover:no-underline"
			href="/spotify/newToken"
		>
			Connect to Spotify
		</a>
	{:else}
		<a
			data-sveltekit-preload-data="tap"
			class="btn btn-wide btn-warning m-1 pointer-events-auto transform transition-transform hover:scale-105 hover:no-underline"
			href="/lobby"
		>
			Create Lobby
		</a>
	{/if}
</div>

<style>
	.tooltip {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.btn[disabled] {
		cursor: not-allowed;
	}
	.background {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
