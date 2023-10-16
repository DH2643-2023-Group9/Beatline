<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io();
	let text: string = '';
	let recieved: string = '';

	socket.on('eventFromServer', (message: string) => {
		recieved = message;
		console.log('Recieved:', message);
	});

	socket.on('echo', (message) => {
		recieved = message;
	});

	function send() {
		console.log(`Sending ${text}`);
		socket.emit('echo', text);
	}
</script>

<div class="p-5">
	<h1>Socket Page</h1>
	<h2>Recieved: {recieved}</h2>
	<input type="text" bind:value={text} class="pointer-events-auto text-black" />
	<button on:click={send} class="pointer-events-auto btn btn-accent">Send</button>
</div>
