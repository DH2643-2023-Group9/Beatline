<script context="module" lang="ts">

	import { PUBLIC_REACT_APP_SOCKET_SERVER } from '$env/static/public';
	import type { ClientToServerEvents, ServerToClientEvents } from '$lib/socketServer';
	import { io, type Socket } from 'socket.io-client';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export type MainContext = {
		socket: Socket<ServerToClientEvents, ClientToServerEvents>;
		myName: Writable<string>;
		isHost: Writable<boolean>;
	};
</script>

<script lang="ts">
	const serverURL = PUBLIC_REACT_APP_SOCKET_SERVER || 'http://localhost:3001';
	const socket = io(serverURL);
	const isHost = writable(false);

	setContext<MainContext>('main', {
		socket,
		myName: writable(''),
		isHost: isHost
	});

	socket.on('assignHost', () => {
		console.log('I am the host');
		$isHost = true;
	});
</script>

<slot />
