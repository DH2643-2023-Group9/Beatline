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
    import { setContext } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
	import { Socket, io } from 'socket.io-client';
	import { randomRoomId } from '$lib/misc';
	import { GameModel } from '$models/game';
	import type { ClientToServerEvents, ServerToClientEvents } from '$lib/socketServer';

	setContext<MainContext>('main', {
		socket: io(),
		roomId: writable<string>(randomRoomId()),
		gameModel: GameModel.initDefault(),
	})

</script>

<slot>

</slot>
