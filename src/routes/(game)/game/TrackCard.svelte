<script lang="ts">
	import type { TrackData } from '$lib/spotify';
	export let track: TrackData;
	export let minimized: boolean;
</script>

<label class="m-2 w-64 h-fit swap swap-flip text-9xl pointer-events-auto">
	<input type="checkbox" class="hidden" />
	<!-- This is hidden assuming you do not want the checkbox to show -->
	<div class="swap-on w-full h-full rounded-xl overflow-hidden bg-neutral-900">
		<img src={track.image.url} alt="Album Artwork" />
		<div class="text-center pl-2 pr-2 p-4">
			<p class="font-bold text-5xl m-2">{track.year}</p>
			{#if !minimized}
				<p class="text-lg">
					{track.name} - <span class="underline">{track.artists[0]}</span>
				</p>
			{/if}
		</div>
		{#if !minimized}
			<audio class="pointer-events-auto w-full">
				<source src={track.preview} type="audio/mpeg" />
			</audio>
		{/if}
	</div>
	<div class="swap-off w-full h-full rounded-xl overflow-hidden bg-neutral-800">
		<img src={'https://i.imgur.com/GCiers3.png'} alt="Beatline" class="w-full h-full" />
	</div>
</label>
