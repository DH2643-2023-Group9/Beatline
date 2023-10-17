<script lang="ts">
	import type { Team } from '$models/game';
	import NoFlipCard from './NoFlipCard.svelte';
	import Timeline from './Timeline.svelte';

	export let teams: Team[];
	export let currentTeam: number;
	let team1: boolean = currentTeam === 0;

	$: {
		setTimeout(() => {
			team1 = currentTeam === 0;
		}, 3000);
	}
</script>

<label
	class="w-full p-4 swap swap-flip-h pointer-events-none flex flex-col items-center justify-center"
>
	<input type="checkbox" class="hidden" checked={team1} />

	<!-- Default Timeline View (assuming for Team 1 or main view) -->
	<Timeline team={teams[0]} swap='off'/>

	<!-- Flipped Timeline View (essentially the same for this example) -->
	<Timeline team={teams[1]} swap='on' />
</label>
