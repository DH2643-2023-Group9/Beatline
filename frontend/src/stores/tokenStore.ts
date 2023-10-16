import { error } from '@sveltejs/kit';
import { writable } from 'svelte/store';
import { PUBLIC_BASE_URL } from '$env/static/public';

export type Tokens = {
	access: string;
	refresh: string;
	validUntil: number;
};

function createTokenStore() {
	let current: Tokens | undefined;
	const { subscribe, set } = writable<undefined | string>(undefined);

	return {
		subscribe,
		/**
		 * Set the user's spotify access tokens.
		 *
		 * This includes the access token, the refresh token,
		 * and the time at which the access token expires.
		 */
		setTokens: (tokens: Tokens) => {
			current = tokens;
			set(tokens.access);
		},
		/**
		 * Refresh the user's tokens.
		 */
		refresh: async () => {
			if (!current) {
				throw error(500, 'Trying to refresh tokens when not logged in');
			} else if (current.validUntil > Date.now()) {
				return;
			}
			const response = await fetch(
				PUBLIC_BASE_URL + '/spotify/refreshToken?token=' + current.refresh
			);
			if (!response.ok) {
				throw error(response.status, await response.text());
			}
			const tokens = await response.json();
			current.access = tokens.access;
			current.validUntil = tokens.validUntil;
			set(tokens.access);
		}
	};
}

/**
 * A custom store for storing tokens.
 */
export const accessToken = createTokenStore();
