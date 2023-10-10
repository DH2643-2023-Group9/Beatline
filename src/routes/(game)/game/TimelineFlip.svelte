<script lang="ts">
	import type { Team } from "$models/game";
	import NoFlipCard from "./NoFlipCard.svelte";

	export let teams: Team[];
</script>

<label class="w-full p-4 swap swap-rotate pointer-events-auto flex flex-col">
	<input type="checkbox" class="hidden" />
  
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

				{#each teams as team}
					{#each team.timeline as { player, guessedYear, track }}
						<div
							class="absolute -top-10 transform -translate-y-full"
							style="left: {((track.year - 1950) / 70) * 100}%"
						>
							<div class="flex items-center">
								<div
									class="w-1 h-24 bg-gray-300 dark:bg-gray-700 rounded-full absolute top-0 mt-10"
								/>
								<NoFlipCard extraClasses='w-40' minimized={true} track={track}>
									<p>{player.name} guessed {guessedYear}.</p>
								</NoFlipCard>
							</div>
						</div>
					{/each}
				{/each}
			</div>
		</div>
	</div>
  
	<!-- Flipped Timeline View (essentially the same for this example) -->
	<div class="swap-on relative w-full h-auto mx-auto">
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

				{#each teams as team}
					{#each team.timeline as { player, guessedYear, track }}
						<div
							class="absolute -top-10 transform -translate-y-full"
							style="left: {((track.year - 1950) / 70) * 100}%"
						>
							<div class="flex items-center">
								<div
									class="w-1 h-24 bg-gray-300 dark:bg-gray-700 rounded-full absolute top-0 mt-10"
								/>
								<NoFlipCard extraClasses='w-40' minimized={true} track={track}>
									<p>{player.name} guessed {guessedYear}.</p>
								</NoFlipCard>
							</div>
						</div>
					{/each}
				{/each}
			</div>
		</div>
	</div>
</label>
