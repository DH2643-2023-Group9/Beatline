<script lang="ts" context="module">
	export type Track = {
		name: string;
		artists: string[];
		album: string;
		year: number;
		image: {
			height: number;
			width: number;
			url: string;
		};
		preview: string | null;
		uri: string;
	};
</script>

<script lang="ts">
	import TrackCard from './TrackCard.svelte';
	export let data: { accessToken: string };
	const userToken = data.accessToken;
	let left = 1950;
	let right = 2020;
	let minimize_card = false;
	let selected_track: Track | undefined = undefined;
	async function get_song(left: number, right: number) {
		const year = Math.floor(Math.random() * (right - left) + left);
		const offset = Math.floor(Math.random() * 800);
		let url = `https://api.spotify.com/v1/search?q=year:${year}&type=track&limit=5&offset=${offset}`;
		let res = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${userToken}`
			}
		});
		if (!res.ok) {
			console.log(await res.text());
			return;
		}
		const data = await res.json();
		const track = data.tracks.items.find((track: any) => track.preview_url != null);
		if (track == undefined) {
			console.log('No track found');
			return;
		}
		selected_track = {
			name: track.name,
			artists: track.artists.map((artist: any) => artist.name),
			album: track.album.name,
			year: year,
			image: track.album.images[0],
			preview: track.preview_url,
			uri: track.uri
		};
	}
</script>

<section class="text-white flex flex-row min-h-screen">
	<div class="p-4 m-5 w-1/2 flex flex-col items-center justify-center">
		<h1 class="text-4xl font-semibold mb-4">Demo Page for Spotify</h1>
		<div>
			<h3 class="text-2xl font-medium mb-2">Select a Year Interval</h3>
			<h4 class="text-xl mb-4">Left: {left}, Right: {right}</h4>
			<input
				class="pointer-events-auto w-full appearance-none h-2 rounded bg-gray-300 mb-2"
				bind:value={left}
				type="range"
				min="1950"
				max="2020"
				step="5"
			/>
			<input
				class="pointer-events-auto w-full appearance-none h-2 rounded bg-gray-300 mb-4"
				bind:value={right}
				type="range"
				min="1950"
				max="2020"
				step="5"
			/>
			<div>
				<button class="btn btn-primary pointer-events-auto" on:click={async () => await get_song(left, right)}
					>Get Song</button
				>
				<button class="btn btn-secondary pointer-events-auto" on:click={() => (minimize_card = !minimize_card)}
					>Minimize Card</button
				>
				<a data-sveltekit-preload-data="tap" class="btn btn-warning pointer-events-auto" href="/createlobby">Create Lobby</a>
			</div>
		</div>
	</div>
	<div class="flex flex-col items-center justify-center w-1/2">
	{#if selected_track !== undefined}
		<h1 class="font-bold underline text-center">Selected Track:</h1>
		<TrackCard track={selected_track} minimized={minimize_card} />
	{/if}
	</div>
</section>

<style>
	h1 {
		width: 100%;
	}
</style>
