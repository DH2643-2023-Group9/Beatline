import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
const { configureServer } = await import('./src/lib/socketServer');

const webSocketServer = {
	name: 'webSocketServer',
	configureServer
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
