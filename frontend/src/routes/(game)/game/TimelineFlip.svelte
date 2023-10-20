<script lang="ts">
	import type { Team } from '$models/game';
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
	class="p-4 pb-20 swap swap-flip-h pointer-events-none grid grid-cols-1"
>
	<input type="checkbox" class="hidden" checked={team1} />

	<!-- Default Timeline View (assuming for Team 1 or main view) -->
	<Timeline timeline={teams[0].timeline} swap='off' />

	<!-- Flipped Timeline View (essentially the same for this example) -->
	<Timeline timeline={teams[1].timeline} swap='on' />
</label>
