import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import { defineConfig } from 'vitest/config';
const { configureServer } = await import('../shared/socketServer');

const webSocketServer = {
	name: 'webSocketServer',
	configureServer: (server: ViteDevServer) => {
		if (!server.httpServer) return;
		const io = new Server(server.httpServer);

		 configureServer(io);
	}

};



export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
