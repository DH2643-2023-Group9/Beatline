<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';

	export let roomId: string | undefined;
	const joinURL = `${PUBLIC_BASE_URL}/join`;
	let copied = false;

	async function copyGameCode() {
		await navigator.clipboard.writeText(roomId || '');
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<!-- Content above the fixed div (stays at the top) -->
<div class="position-fixed top-0 left-0 right-0 px-5 flex justify-between">
	<a class="pointer-events-auto" href="/">
		<img src={'beatlinepng.png'} alt="Beatline" class="w-[200px]" />
	</a>
	<div class="flex justify-center items-center text-xl">
		<!-- Game Code and Link -->
		Copy
		<a
			class="pointer-events-auto text-purple-400 mr-1 ml-1"
			target="_blank"
			href={joinURL + `?roomId=${roomId}`}>this</a
		>
		link, or go to
		<a class="pointer-events-auto text-purple-400 mr-1 ml-1" href={joinURL}>{joinURL}</a>
		and enter code
		<span
			class="pointer-events-auto cursor-pointer text-purple-400 ml-1"
			role="mark"
			on:click={copyGameCode}
		>
			{roomId}
		</span>
		{#if copied}<span class="text-green-500 mr-1 ml-1">(Copied!)</span>{/if}.
	</div>
</div>
