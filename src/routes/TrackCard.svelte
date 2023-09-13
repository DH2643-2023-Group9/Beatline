<script lang="ts">
	import type { Track } from './+page.svelte';
	export let track: Track;
	export let minimized: boolean;
	console.log(track);
</script>

<section>
	<div class="container">
		<h1 class="font-bold underline">Selected Track:</h1>
		<div class="card">
			<img src={track.image.url} alt="Album Artwork" />
            <div class="track-info">
				<p class="year">{track.year}</p>
				{#if !minimized}
					<p class="text">{track.name} - {track.artists[0]}</p>
				{/if}
            </div>
			<audio class=pointer-events-auto controls style="width: 100%">
				<source src={track.preview} type="audio/mpeg" />
			</audio>
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
	.year {
        font-size: xx-large;
		font-weight: bold;
		z-index: 2;
	}
	.text {
		font-size: large;
		z-index: -1;
	}
    .track-info {
		text-align: center;
        padding-left: 4em;
		padding-right: 4em;
		border-radius: var(--radius);
    }
</style>