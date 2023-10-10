<script lang=ts>
	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	import Card from './Card.svelte'

	$: if (dialog && showModal) dialog.showModal();
</script>

<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div on:click|stopPropagation>
		<Card extraClasses="p-8 rounded-none shadow-lg w-96 space-y-6 border-[#6200EA] min-w-[1200px] min-h-[500px]">
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
	
	</div>
</dialog>

<style>

</style>
