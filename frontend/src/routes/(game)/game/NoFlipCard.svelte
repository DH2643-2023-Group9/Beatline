<script lang="ts">
	import type { TrackData } from '$lib/spotify';
	export let track: TrackData;
	export let minimized: boolean;
	export let extraClasses = '';
</script>

<div class="m-2 h-fit swap swap-flip text-9xl pointer-events-none {extraClasses}">
	<!-- This is hidden assuming you do not want the checkbox to show -->
	<div class="swap-off w-full h-full rounded-xl overflow-hidden bg-neutral-900">
		<img src={track.image.url} alt="Album Artwork" />
		<div class="text-center pl-2 pr-2 p-4">
			<p class="font-bold text-5xl m-2">{track.year}</p>
			{#if !minimized}
				<p class="text-lg">
					{track.name} - <span class="underline">{track.artists[0]}</span>
				</p>
			{/if}
		</div>
	</div>
</div>
