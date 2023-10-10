<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MainContext } from '../+layout.svelte';
	import { getContext } from 'svelte';

	const { socket } = getContext<MainContext>('main');
    let roomId = '';
    let name = '';

	function joinRoom() {
		if (roomId === '' || name === '') {
			alert('Please enter a room ID and name.');
			return;
		}
		socket.emit('joinRoom', { roomId, name });
	}

	socket.on('error', (error) => {
		alert(error);
	});

	socket.on('joinRoom', ({ name, userId }) => {
		// Handle successful join. Might update some UI or set some internal state.
		console.log(`User ${name}(${userId}) joined the room`);
        if (userId === socket.id) {
            // Got confirmation that we joined the room
            goto('/play')
        }
	});
</script>

<div class="flex flex-col items-center justify-center h-screen p-4 md:p-8">
	<h1 class="text-2xl md:text-4xl mb-4">Join a Game Room</h1>
    
	<div class="w-full max-w-md">
		<label class="block mb-2 text-lg">
			Room ID:
			<input type="text" bind:value={roomId} class="pointer-events-auto input input-primary mt-1 w-full text-black"/>
		</label>
        
		<label class="block mb-4 text-lg">
			Your Name:
			<input type="text" bind:value={name} class="pointer-events-auto input input-secondary mt-1 w-full  text-black"/>
		</label>
        
		<button on:click={joinRoom} class="pointer-events-auto btn btn-accent w-full mt-2">Join</button>
	</div>
</div>