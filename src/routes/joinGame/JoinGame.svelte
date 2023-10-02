<script lang="ts">

	export let socket: any;
	export let startGame: () => void;
    export let joinRoom: (name: string, roomId: string) => void;
    let name: string;
    let roomId: string;
     // Trigger the startGame function when the socket event is received
    function sendAnswer(name: string, roomId: string) {
        joinRoom(name, roomId);
    }
</script>

<div class="flex flex-col items-center">
	<h1>Join a Game Room</h1>
	<label>
		Room ID:
		<input type="text" bind:value={roomId} class="pointer-events-auto input input-primary m-2 text-black"/>
	</label>
	<label>
		Your Name:
		<input type="text" bind:value={name} class="pointer-events-auto input input-secondary m-2 text-black"/>
	</label>
	<button on:click={() => sendAnswer(name,roomId)} class="pointer-events-auto btn btn-accent w-fit">Join</button>
</div>
