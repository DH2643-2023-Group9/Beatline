<script lang="ts">
	export let socket: any;
	export let roomIdVariable: string;
	export let nameVariable: string;
	export let myTurn: boolean;
	export let setMyTurn: (bool: boolean) => void;

	let answer: number;
	const startYear = 1950;
	const endYear = 2020;
	const years = Array(endYear - startYear + 1).fill(null).map((_, index) => startYear + index);

	function send() {
		if (!answer) {
			alert('Please select a year.');
			return;
		}
		socket.emit('submitAnswer', { roomId: roomIdVariable, answer: answer.toString() , name: nameVariable});
		setMyTurn(false);
	}
</script>

<div class="flex flex-col items-center justify-center h-screen p-4 md:p-8">
    {#if myTurn}
		<h1 class="text-2xl md:text-4xl mb-4">Enter your answer</h1>
		<div class="w-full max-w-md">
			<label class="block mb-2 text-lg">
				Year:
				<select bind:value={answer} class="select select-bordered w-full mt-1 pointer-events-auto text-black">
					<option value="" disabled selected>Select a year</option>
					{#each years as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</label>
			<button on:click={send} class="btn btn-primary mt-2 pointer-events-auto w-full">Submit Year</button>
		</div>
    {:else}
		<h1 class="text-2xl md:text-4xl mb-4">Waiting for other players to submit their answers...</h1>
    {/if}
</div>
