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
{#if myTurn}
	<div class="flex flex-col items-center">
		<h1>Enter your answer</h1>
		<label class="pointer-events-auto">
			Year:
			<select bind:value={answer} class="select select-bordered w-full max-w-xs">
				<option value="" disabled selected>Select a year</option>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		</label>
		<button on:click={send} class="btn btn-primary mt-4 pointer-events-auto">Submit Year</button>
	</div>
{:else}
	<div class="flex flex-col items-center">
		<h1>Waiting for other players to submit their answers...</h1>
	</div>
{/if}

