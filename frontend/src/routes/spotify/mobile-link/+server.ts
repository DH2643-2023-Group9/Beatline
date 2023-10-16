import { error, type RequestHandler } from '@sveltejs/kit';

/**
 * Get the actual playlist URL from a mobile link by following redirects.s
 */
export const GET: RequestHandler = async ({ url }) => {
	// Get the playlist url from the mobile redirect
	const playlistUrl = url.searchParams.get('url');
	if (!playlistUrl) {
		throw error(400, 'Missing playlist URL');
	}
	const response = await fetch(playlistUrl, {
		method: 'HEAD',
		redirect: 'manual',
		headers: {
			'User-Agent': 'curl/7.68.0' // or whatever version of curl you are using
		}
	});
	const location = response.headers.get('location');
	if (!location) {
		throw error(400, 'Invalid playlist URL');
	}
	return new Response(location);
};
