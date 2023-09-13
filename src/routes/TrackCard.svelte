<script lang="ts">
	import type { Track } from './+page.svelte';
	export let track: Track;
	export let minimized: boolean;
</script>

<section>
	<div class="container">
		<h1 class="font-bold underline text-2xl">Selected Track:</h1>
		<div class="card">
			<img src={track.image.url} alt="Album Artwork" />
			<div class="track-info">
				<p class="font-bold text-5xl m-2">{track.year}</p>
				{#if !minimized}
					<p class="text-lg">{track.name} - <span class="underline">{track.artists[0]}</span></p>
				{/if}
			</div>
			{#if !minimized}
				<audio class="pointer-events-auto w-auto" controls>
					<source src={track.preview} type="audio/mpeg" />
				</audio>
			{/if}
		</div>
	</div>
</section>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 450px;
		padding: 0;
		--radius: 20px;
		border-radius: var(--radius);
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
		--card-bg: rgb(60, 60, 60);
		background-color: var(--card-bg);
		color: rgb(240, 240, 240);
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
