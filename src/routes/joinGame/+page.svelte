<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io();

	let roomId: string;
	let name: string;

	function joinRoom() {
		if (!roomId || !name) {
			alert('Please enter a room ID and your name.');
			return;
		}
		socket.emit('joinRoom', { roomId, name });
	}

	socket.on('error', (data) => {
		alert(data.error);
	});

	socket.on('joinRoom', (data) => {
		// Handle successful join if necessary, e.g., navigate to the game page or update UI.
		console.log(data);
	});
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
	<button on:click={joinRoom} class="pointer-events-auto btn btn-accent w-fit">Join</button>
</div>
