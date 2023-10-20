<!-- Timeline.svelte -->

<script lang="ts">
	import { range } from '$lib/utils';
	import type { Team } from '$models/game';
	import NoFlipCard from './NoFlipCard.svelte';

	export let timeline: Team['timeline'];
	export let swap: 'off' | 'on';
	$: timelineLength = timeline.length;
</script>

<div class="swap-{swap} w-full h-fit mx-auto">
	<div class="flex flex-col items-center justify-center p-4">
		<div class="flex flex-row w-full justify-around">
			{#each timeline as { guesses }}
				<div class="stack flex -space-x-36">
					{#each guesses as { track }}
						<NoFlipCard extraClasses="w-40" minimized={true} {track} />
					{/each}
				</div>
			{/each}
		</div>
		<div class="w-full h-1 bg-gray-300" />
		<div class="flex flex-row w-full justify-between">
			{#each range(0, timelineLength) as _}
				<div class="w-1 h-4 bg-gray-300 dark:bg-gray-300 rounded-full -translate-y-1/2" />
			{/each}
		</div>
	</div>
</div>
