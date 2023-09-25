import { SPOTIFY_CLIENT_ID } from '$env/static/private';
import { requestToken } from '$lib/server/spotifyUtils';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const refreshToken = url.searchParams.get('token');
	if (!refreshToken) {
		throw error(400, 'Missing refresh token');
	}

	return requestToken({
		grant_type: 'refresh_token',
		client_id: SPOTIFY_CLIENT_ID,
		refresh_token: refreshToken
	}).then(json);
};
