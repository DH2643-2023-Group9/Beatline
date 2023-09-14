import { error, redirect } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URL } from '$env/static/private';


/** @type {import('./$types').PageServerLoad} */
export async function load({ url, cookies }) {
    if (cookies.get('accessToken')) {
        // User is already connected
        throw redirect(303, '/');
    }
    // Get the code from Spotify's authentication response
    const code = url.searchParams.get('code');
    if (!code) {
        throw error(401, 'Missing code');
    }
    const form = {
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URL,
        grant_type: 'authorization_code',
    };
    // Get access token for the current user
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(form)
    });
    if (!response.ok) {
        throw error(response.status, response.statusText);
    }
    const data = await response.json();
    cookies.set('accessToken', data.access_token);
    cookies.set('refreshToken', data.refresh_token);

    // Redirect back to the homepage
    throw redirect(303, '/');
}
