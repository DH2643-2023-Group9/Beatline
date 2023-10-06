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
	const track = data.tracks.items.find((track: any) => track.preview_url != null);
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
