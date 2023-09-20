import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requestToken } from '$lib/server/spotifyUtils';

const SCOPE = 'user-read-private user-read-email';

export const load: PageServerLoad = async ({ url }) => {
	const code = url.searchParams.get('code');
	if (!code) {
		// Redirect the user to Spotify's authentication page
		throw redirect(
			303,
			'https://accounts.spotify.com/authorize?' +
				new URLSearchParams({
					response_type: 'code',
					client_id: SPOTIFY_CLIENT_ID,
					scope: SCOPE,
					redirect_uri: SPOTIFY_REDIRECT_URL
				})
		);
	}

	return requestToken({
		code: code,
		redirect_uri: SPOTIFY_REDIRECT_URL,
		grant_type: 'authorization_code'
	});
};
