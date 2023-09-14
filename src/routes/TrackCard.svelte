<script lang="ts">
	import type { Track } from './+page.svelte';
	export let track: Track;
	export let minimized: boolean;
	export let flipped: boolean;

	function flip(node: any, { delay = 0, duration = 800 }: { delay?: number; duration?: number }) {
		return {
			delay,
			duration,
			css: (t: number, u: number) => `
			transform: rotateY(${1 - u * 180}deg);
			opacity: ${1 - u};
			`
		};
	}
</script>

<section>
	<h1 class="font-bold underline">Selected Track:</h1>
	<div class="container">
		<div class="card">
			{#if flipped}
				<div class="front" transition:flip>
					<img src={track.image.url} alt="Album Artwork" />
					<div class="track-info">
						<p class="font-bold text-5xl m-2">{track.year}</p>
						{#if !minimized}
							<p class="text-lg">
								{track.name} - <span class="underline">{track.artists[0]}</span>
							</p>
						{/if}
					</div>
					{#if !minimized}
						<audio class="pointer-events-auto w-full" controls>
							<source src={track.preview} type="audio/mpeg" />
						</audio>
					{/if}
				</div>
			{:else}
				<div class="front" transition:flip>
					<img src={'https://i.imgur.com/GCiers3.png'} alt="Beatline" />
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		aspect-ratio: 1/1.3;
		width: 450px;
	}
	.card {
		width: 100%;
		height: 100%;
		position: absolute;
		perspective: 600;
	}

	.front {
		position: absolute;
		padding: 0;
		--radius: 20px;
		border-radius: var(--radius);
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
		--card-bg: rgb(60, 60, 60);
		background-color: var(--card-bg);
		color: rgb(240, 240, 240);
		perspective: 600;
	}

	.card img {
		width: 100%;
		border-radius: var(--radius) var(--radius) 0 0;
	}
	.track-info {
		text-align: center;
		padding-left: 4em;
		padding-right: 4em;
		border-radius: var(--radius);
	}
</style>
