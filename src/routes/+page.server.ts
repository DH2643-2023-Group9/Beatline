import { redirect } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID } from '$env/static/private';

// The scopes that the application needs from the user 
// (This will probably need to change)
const SCOPE = 'user-read-private user-read-email';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, cookies }) {
    const accessToken = cookies.get('accessToken');
    if (!accessToken) {
        // User is not connected, redirect to Spotify's authentication page
        throw redirect(303, 'https://accounts.spotify.com/authorize?' +
            new URLSearchParams({
                response_type: 'code',
                client_id: SPOTIFY_CLIENT_ID,
                scope: SCOPE,
                redirect_uri: `${url.href}connect-spotify`,
            })
        );
    }
    return {
        accessToken: accessToken
    }
}
