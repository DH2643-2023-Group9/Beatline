<script context="module" lang="ts">
	import type { ClientToServerEvents, ServerToClientEvents } from '$lib/socketServer';
	import { io, type Socket } from 'socket.io-client';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export type MainContext = {
		socket: Socket<ServerToClientEvents, ClientToServerEvents>;
		myName: Writable<string>;
	};
</script>

<script lang="ts">
	setContext<MainContext>('main', {
		socket: io(),
		myName: writable(''),
	});
</script>

<slot />
