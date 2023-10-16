import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export async function requestToken(body: { [key: string]: string }) {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET),
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		},
		body: new URLSearchParams(body)
	});

	if (!response.ok) {
		console.log('Error when requesting access token:', response.status, await response.text());
		throw error(response.status, await response.text());
	}

	const data = await response.json();

	return {
		access: data.access_token,
		refresh: data.refresh_token,
		validUntil: Date.now() + data.expires_in * 1000
	};
}
