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
	let left = 1950;
	let right = 2020;
	const client_secret = '';
	const user_token = '';
	const refresh_token = '';
	let minimize_card = false;
	let selected_track: Track | undefined = {
		album: 'Cut To The Feeling',
		artists: ['Carly Rae Jepsen'],
		image: {
			height: 640,
			url: 'https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1',
			width: 640
		},
		year: 2002,
		name: 'Cut To The Feeling',
		preview:
			'https://p.scdn.co/mp3-preview/425d081433204c6ded4ae8f852ee89e5d5bcdc0d?cid=fd1121824a964f25a3f1ede3f782e0cf',
		uri: 'spotify:track:11dFghVXANMlKmJXsNCbNl'
	};
	async function get_song(left: number, right: number) {
		const year = Math.floor(Math.random() * (right - left) + left);
		const offset = Math.floor(Math.random() * 1000);
		let url = `https://api.spotify.com/v1/search?q=year:${year}&type=track&limit=5&offset=${offset}`;
		let res = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${user_token}`
			}
		});
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

<section>
	<div>
		<h1>Demo Page for Spotify Stuff</h1>
		<div>
			<h3>Select a Year Interval</h3>
			<h4>Left: {left}, Right: {right}</h4>
			<input bind:value={left} type="range" min="1950" max="2020" step="5" />
			<input bind:value={right} type="range" min="1950" max="2020" step="5" />
			<div>
				<button on:click={async () => await get_song(left, right)}>Get Song</button>
				<button on:click={() => (minimize_card = !minimize_card)}>Minimize Card</button>
			</div>
		</div>
	</div>

	{#if selected_track !== undefined}
		<TrackCard track={selected_track} minimized={minimize_card} />
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	section > div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: fit-content;
		margin: 5em;
	}

	h1 {
		width: 100%;
	}
</style>
