export type TrackData = {
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

/**
 * Validates a track object from the Spotify API.
 */
function validateTrack(track: any): boolean {
	return (
		track.name != undefined &&
		track.artists != undefined &&
		track.album != undefined &&
		track.album.images != undefined &&
		track.album.images.length > 0 &&
		track.album.images[0].url != undefined &&
		track.preview_url != undefined &&
		track.uri != undefined
	);
}

/**
 * Gets a random track from the Spotify API.
 * @param left Lower bound for the year interval
 * @param right Upper bound for the year interval
 * @param accessToken Spotify access token
 */
export async function getTrackData(left: number, right: number, accessToken: string): Promise<TrackData> {
	const year = Math.floor(Math.random() * (right - left) + left);
	const offset = Math.floor(Math.random() * 100);
	const url = `https://api.spotify.com/v1/search?q=year:${year}&type=track&limit=5&offset=${offset}`;
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (!res.ok) {
		console.log(await res.text());
		throw new Error('Failed to fetch song');
	}
	const data = await res.json();
	const track = data.tracks.items.find(validateTrack);
	if (track == undefined) {
		console.log('No track found');
		throw new Error('No track found');
	}
	return {
		name: track.name,
		artists: track.artists.map((artist: any) => artist.name),
		album: track.album.name,
		year: year,
		image: track.album.images[0],
		preview: track.preview_url,
		uri: track.uri
	};
}
