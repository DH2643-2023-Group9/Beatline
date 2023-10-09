<script lang="ts">
    export let socket: any;
    export let startGame: () => void;
    export let joinRoom: (name: string, roomId: string) => void;
    
    let name: string;
    let roomId: string;
    
    function sendAnswer(name: string, roomId: string) {
        joinRoom(name, roomId);
    }
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
        
		<button on:click={() => sendAnswer(name, roomId)} class="pointer-events-auto btn btn-accent w-full mt-2">Join</button>
	</div>
</div>
