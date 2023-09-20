import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URL } from '$env/static/private';
// The scopes that the application needs from the user 
// (This will probably need to change)
const SCOPE = 'user-read-private user-read-email';

export const load: PageServerLoad = async ({ url, cookies }) => {
    const accessToken = cookies.get('accessToken');
    if (!accessToken) {
        // User is not connected, redirect to Spotify's authentication page
        throw redirect(303, 'https://accounts.spotify.com/authorize?' +
            new URLSearchParams({
                response_type: 'code',
                client_id: SPOTIFY_CLIENT_ID,
                scope: SCOPE,
                redirect_uri: SPOTIFY_REDIRECT_URL,
            })
        );
    }
    return {
        accessToken: accessToken
    }
}