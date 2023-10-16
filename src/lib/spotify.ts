import { PUBLIC_BASE_URL } from '$env/static/public';

export type TrackData = {
	name: string;
	artists: string[];
	album: string;
	year: number;
	image: Image;
	preview: string | null;
	uri: string;
	id: string;
};

export type PlaylistData = {
	name: string;
	description: string;
	id: string;
	images: Image[];
	numTracks: number;
};

type Image = {
	height: number;
	width: number;
	url: string;
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

async function request(url: string, accessToken: string, method: string = 'GET'): Promise<any> {
	const res = await fetch(url, {
		method,
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (!res.ok) {
		const msg = `Error when performing Spotify request: ${await res.text()}`;
		console.log(msg);
		throw new Error(msg);
	}
	return res.json();
}

function formatTrackData(track: any): TrackData {
	return {
		name: track.name,
		artists: track.artists.map((artist: any) => artist.name),
		album: track.album.name,
		year: track.album.release_date.split('-')[0],
		image: track.album.images[0],
		preview: track.preview_url,
		uri: track.uri,
		id: track.id
	};
}

/**
 * Gets a random track from the Spotify API.
 * @param left Lower bound for the year interval
 * @param right Upper bound for the year interval
 * @param accessToken Spotify access token
 */
export async function getTrackData(
	left: number,
	right: number,
	accessToken: string,
	difficulty: number
): Promise<TrackData> {
	const maxTries = 4;
	let track: any | undefined;
	let year = 0;
	for (let i = 0; i < maxTries && track === undefined; i++) {
		year = Math.floor(Math.random() * (right - left) + left);
		const offset = Math.floor(Math.random() * difficulty);
		const url = `https://api.spotify.com/v1/search?q=year:${year}&type=track&limit=5&offset=${offset}`;
		const data = await request(url, accessToken);
		track = data.tracks.items.find(validateTrack);
		if (track === undefined) {
			console.log('No track found, got', data);
		}
	}
	if (track === undefined) {
		const msg = `No track found after ${maxTries} tries`;
		console.log(msg);
		throw new Error(msg);
	}
	return formatTrackData(track);
}

/**
 * Get information about a Spotify playlist.
 * @param id ID of the playlist
 * @param accessToken Spotify access token
 */
export async function getPlayListData(id: string, accessToken: string): Promise<PlaylistData> {
	const res = await request(`https://api.spotify.com/v1/playlists/${id}`, accessToken);
	const playlist = {
		name: res.name,
		description: res.description,
		id: res.id,
		images: res.images,
		numTracks: res.tracks.total
	};
	return playlist;
}

/**
 * Given a playlist ID, returns a random track from the playlist.
 * @param playlist The playlist to sample from
 * @param accessToken Spotify access token
 * @param excludedOffsets An array of offsets to exclude from the random selection
 */
export async function sampleFromPlaylist(
	playlist: PlaylistData,
	accessToken: string,
	excludedOffsets?: number[]
): Promise<{ track: TrackData; offset: number; invalidOffsets: number[] }> {
	if (excludedOffsets && excludedOffsets.length >= playlist.numTracks) {
		throw new Error('All tracks in playlist have been used');
	}
	const maxTries = 10;
	const invalidOffsets: number[] = [];
	let offset = Math.floor(Math.random() * playlist.numTracks);
	for (let i = 0; i < maxTries; i++) {
		while (excludedOffsets && excludedOffsets.includes(offset) && invalidOffsets.includes(offset)) {
			offset = Math.floor(Math.random() * playlist.numTracks);
		}
		const url = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?offset=${offset}`;
		const res = await request(url, accessToken);
		const track = res.items[0].track;
		if (!validateTrack(track)) {
			continue;
		}
		return { track: formatTrackData(track), offset, invalidOffsets };
	}
	const err = `No track found after ${maxTries} tries`;
	console.log(err);
	throw new Error(err);
}

const idRegex = /^([a-zA-Z0-9]{22})$/;
const playlistLink = /^https:\/\/open.spotify.com\/playlist\/([a-zA-Z0-9]{22})/;
const mobileLink = /^https:\/\/spotify.link\/[a-zA-Z0-9]{11}$/;
/**
 * Given a URL or ID, returns the playlist ID.
 * Works with direct playlist links or mobile links.
 * @param url URL or ID of the playlist
 * @throws Error if the URL is invalid
 */
export async function getPlaylistId(url: string): Promise<string> {
	if (idRegex.test(url)) {
		return url;
	} else if (!url.startsWith('https://')) {
		url = 'https://' + url;
	}

	if (mobileLink.test(url)) {
		// Get the playlist url from the mobile redirect
		const res = await fetch(PUBLIC_BASE_URL + '/spotify/mobile-link?url=' + url);
		if (res.status !== 200) {
			throw new Error(`Invalid playlist URL: ${url}`);
		}
		url = await res.text();
	}

	const match = url.match(playlistLink);
	if (match === null || match.length !== 2) {
		throw new Error(`Invalid playlist URL: ${url}`);
	}
	return match[1];
}
