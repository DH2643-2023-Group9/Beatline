<script context="module" lang="ts">
	export type PlayerInfo = {
		name: string;
		id: string;
		team?: number;
		host: boolean;
	};
	export type MainContext = {
		socket: Socket<ServerToClientEvents, ClientToServerEvents>;
		roomId: Writable<string>;
		gameModel: GameModel;
	};
</script>

<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { Socket, io } from 'socket.io-client';
	import { randomRoomId } from '$shared/misc';
	import { GameModel } from '$models/game';
	import type { ClientToServerEvents, ServerToClientEvents } from '$shared/socketServer';
	import { PUBLIC_REACT_APP_SOCKET_SERVER } from '$env/static/public';

	const serverURL = PUBLIC_REACT_APP_SOCKET_SERVER;
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
		serverURL === 'dev' ? io() : io(serverURL);
	const gameModel = GameModel.initDefault();

	setContext<MainContext>('main', {
		socket,
		roomId: writable<string>(randomRoomId()),
		gameModel
	})
	
	onDestroy(() => {
		socket.disconnect();
	});

</script>

<slot />
