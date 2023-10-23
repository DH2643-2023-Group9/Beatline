<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_REACT_APP_SOCKET_SERVER } from '$env/static/public';
	import type { ClientToServerEvents, ServerToClientEvents } from '$shared/socketServer';
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
	const serverURL = PUBLIC_REACT_APP_SOCKET_SERVER;
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
		serverURL === 'dev' ? io() : io(serverURL);
	const isHost = writable(false);
	const myName = writable('');

	setContext<MainContext>('main', {
		socket,
		myName,
		isHost: isHost
	});

	socket.on('assignHost', () => {
		$isHost = true;
	});

	socket.on('lobbyDisconnected', () => {
		alert('The lobby has been disconnected 😿');
		goto(`/join?name=${$myName}`);
	});

	socket.on('deleteRoom', () => {
		alert('Game Ended');
		goto(`/join?name=${$myName}`);
	});
</script>

<slot />
