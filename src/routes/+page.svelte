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
	<!-- Centered Create Lobby button -->
	<a
		data-sveltekit-preload-data="tap"
		class="btn btn-warning m-1 pointer-events-auto transform transition-transform hover:scale-105"
		href="/lobby">Create Lobby</a
	>
	<button class="pointer-events-auto btn btn-info flex float-right" on:click={() => (showModal = true)}> How-to-play </button>

	<Modal bind:showModal>
	</Modal>
	{#if !$accessToken}
		<a
			data-sveltekit-preload-data="tap"
			class="btn btn-accent m-1 pointer-events-auto"
			href="/spotify/newToken"
			>Connect to Spotify
		</a>
	{:else}
		<button class="btn btn-accent m-1 pointer-events-auto" on:click={accessToken.refresh}>
			Refresh Token
		</button>
	{/if}

	<!-- User profile button -->
	<div class="flex items-start justify-end pointer-events-auto w-full absolute top-0 right-0">
		<div class="dropdown dropdown-end m-6">
			<label tabindex="0" class="mb-3 cursor-pointer">
				<div class="avatar transform transition-transform hover:scale-105 hover:shadow-lg">
					<div class="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
						<img src="favicon.png" alt="User Avatar" />
					</div>
				</div>
			</label>
			<ul
				tabindex="0"
				class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-black"
			>
				<li><a>Item 1</a></li>
				<li><a>Item 2</a></li>
			</ul>
		</div>
	</div>
</div>

<style>
	.background {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
