<script lang=ts>
	export let showModal: boolean;
    export let extraClasses = ''; // Declare a class prop with a default value of an empty string

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div class="border border-[#EC407A] shadow-2xl p-8 bg-[#272727] text-white font-mono$ h-1/2 {extraClasses}" on:click|stopPropagation>
		<slot name="header" />
		<slot />

	</div>
</dialog>

<style>

</style>
