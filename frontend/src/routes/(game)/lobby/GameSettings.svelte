<script lang="ts">
	import { range } from '$lib/utils';
	import type { LimitType } from '$models/game';
	import RangeSlider from 'svelte-range-slider-pips';

	export let limit: number;
	export let difficulty: number;
	export let limitType: LimitType;
	export let interval: number[];
	console.log(limitType)
</script>

<div>
	<label for="players" class="block text-lg font-bold"> Game Settings: </label>
	<span class="flex items-center justify-evenly">
		<label for="radio-1" class="text-sm font-bold flex flex-col text-justify items-center">
			<input
				type="radio"
				id="byRounds"
				name="radio-1"
				class="pointer-events-auto radio radio-secondary"
				bind:group={limitType}
				value={'rounds'}
			/>
			By rounds
		</label>

		<label for="radio-2" class="text-sm font-bold flex flex-col text-justify items-center">
			<input
				type="radio"
				id="byScore"
				name="radio-1"
				class="pointer-events-auto radio radio-secondary"
				bind:group={limitType}
				value={'score'}
			/>
			By score
		</label>
	</span>
</div>

{#if limitType === 'rounds'}
	<div>
		<label for="byRounds" id="byRounds" class="block text-sm font-bold"> Number of Rounds </label>
		<input
			type="range"
			class="pointer-events-auto range range-secondary bg-neutral"
			min="6"
			max="20"
			step="2"
			bind:value={limit}
		/>
		<div class="w-full flex justify-between text-xs font-bold px-2">
			{#each range(6, 20, 2) as round}
				<span>{round}</span>
			{/each}
		</div>
	</div>
{/if}

{#if limitType === 'score'}
	<div>
		<label for="byScore" id="byScore" class="block text-sm font-bold"> Max Score </label>
		<input
			type="range"
			class="pointer-events-auto range range-secondary bg-neutral"
			min="6"
			max="20"
			step="2"
			bind:value={limit}
		/>
		<div class="w-full flex justify-between text-xs font-bold px-2">
			{#each range(6, 20, 2) as score}
				<span>{score}</span>
			{/each}
		</div>
	</div>
{/if}

<div>
	<label for="radio-2" class="block text-lg font-bold"> Difficulty: </label>
	<span class="flex items-center justify-evenly">
		<label for="radio-2" class="text-sm font-medium text-justify flex flex-col items-center">
			<input
				type="radio"
				name="radio-2"
				class="pointer-events-auto radio radio-secondary"
				checked={difficulty === 100}
			/>
			Easy
		</label>
		<label for="radio-2" class="text-sm font-medium text-justify flex flex-col items-center">
			<input
				type="radio"
				name="radio-2"
				class="pointer-events-auto radio radio-secondary"
				checked={difficulty === 500}
			/>
			Medium
		</label>
		<label for="radio-2" class="text-sm font-medium text-justify flex flex-col items-center">
			<input
				type="radio"
				name="radio-2"
				class="pointer-events-auto radio radio-secondary"
				checked={difficulty === 1000}
			/>
			Hard
		</label>
	</span>
</div>

<div class="slider pointer-events-auto">
	<RangeSlider
		id="sliderInRange"
		float
		pips
		all="label"
		bind:values={interval}
		min={1930}
		max={2030}
		step={10}
	/>
</div>
