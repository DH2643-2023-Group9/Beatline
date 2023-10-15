<script lang="ts">
	import type { Team } from '$models/game';
	import NoFlipCard from './NoFlipCard.svelte';

	export let teams: Team[];
	export let currentTeam: number;
	let team1: boolean = true;

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
	<div class="swap-off relative w-full h-auto mx-auto">
		<div class="flex items-center justify-center p-4">
			<div class="relative w-3/4 h-auto mx-auto">
				<div class="absolute top-1/2 left-0 w-full h-1 bg-gray-300" />
				{#each Array(8) as _, i}
					<div
						class="absolute top-1/2 transform -translate-y-1/2 text-center"
						style="left: {(i / 7) * 100}%"
					>
						<div class="w-1 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
					</div>
				{/each}

				{#each teams[0].timeline as { year, guesses }}
					<div
						class="absolute -top-10 transform -translate-y-full"
						style="left: {((year - 1950) / 70) * 100}%"
					>
						<div class="stack flex -space-x-36">
							{#each guesses as { track, player, guessedYear }}
								<NoFlipCard extraClasses="w-40" minimized={true} {track}>
									<p>{player?.name} guessed {guessedYear}.</p>
								</NoFlipCard>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Flipped Timeline View (essentially the same for this example) -->
	<div class="swap-on relative w-full h-auto mx-auto">
		<div class="flex items-center justify-center p-4 -translate-y-8">
			<div class="relative w-3/4 h-auto mx-auto">
				<div class="absolute top-1/2 left-0 w-full h-1 bg-gray-300" />
				{#each Array(8) as _, i}
					<div
						class="absolute top-1/2 transform -translate-y-1/2 text-center"
						style="left: {(i / 7) * 100}%"
					>
						<div class="w-1 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
					</div>
				{/each}

				{#each teams[1].timeline as { year, guesses }}
					<div
						class="absolute -top-10 transform -translate-y-full"
						style="left: {((year - 1950) / 70) * 100}%"
					>
						<div class="stack flex -space-x-36">
							{#each guesses as { track, player, guessedYear }}
								<NoFlipCard extraClasses="w-40" minimized={true} {track}>
									<p>{player?.name} guessed {guessedYear}.</p>
								</NoFlipCard>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</label>
