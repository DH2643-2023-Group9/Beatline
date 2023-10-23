<script lang=ts>
	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	import Card from './Card.svelte'

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<Card extraClasses="p-8 rounded-none shadow-lg w-96 space-y-6 border-[#6200EA] min-w-[1200px] min-h-[500px]">
			<h1 class="text-centre box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-5xl">
				How do you play Beatline?
			</h1>
			<h2 class="text-2xl">Rules:</h2>
			<div>
				At the start of the game, each team is given a random track. 
				For each round, you'll be given a new track and you'll have to place it in the correct order in your timeline. 
				The team with the most correct answers wins!
			</div>
			<h2 class="text-2xl">Setting up the Game:</h2>
			<h3 class="text-xl">
				Step 1. Start a lobby
			</h3>
			<div>
				Log in via Spotify and create a lobby and connect your friends via their phones! Watch the game play out on your TV screen while you all relax in the sofa! Once you've started the lobby, the rest can be accessed via your phones. Maximum number of devices is 10! But you can always play several players on one device 😊
			</div>
			<h3 class="text-xl">
				Step 2. Join!
			</h3>
			<div>
				Once everyone has joined, let the host start the game by clicking Start Game on their phone.
				When started, you'll see an individual timeline for each team. You'll have a set amount of time to identify in which inteval that song fits in! The more correct answers you get, the harder it will become!
			</div>

			<h3 class="text-xl">
				Step 3. Have fun!
			</h3>

			<div>

			</div>
			
		</Card>
	
	</div>
</dialog>

<style>

</style>
