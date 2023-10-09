<script context="module" lang="ts">
	export type PlayerInfo = {
		name: string;
		id: string;
		team?: number;
	};
	export type MainContext = {
		socket: Socket<DefaultEventsMap, DefaultEventsMap>;
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
	import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

	setContext<MainContext>('main', {
		socket: io(),
		roomId: writable<string>(randomRoomId()),
		gameModel: new GameModel([0, 0], 0, 'rounds'),
	})

</script>

<slot>

</slot>
