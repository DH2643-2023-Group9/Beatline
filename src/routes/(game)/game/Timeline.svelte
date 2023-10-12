<script lang="ts">
	import type { Team } from "$models/game";
	import NoFlipCard from "./NoFlipCard.svelte";

    export let team: Team;
    export let swap: 'off' | 'on';
    const name = team.name;
    const timeline = team.timeline;
    console.log('team=',team)
    let translate = '';
    if (swap === 'on') {
        translate = '-translate-y-8'
    }
</script>

<div class="swap-{swap} relative w-full h-auto mx-auto">
    <div class="flex items-center justify-center p-4 {translate}">
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

            {#each timeline as { year, guesses }}
                <div
                    class="absolute -top-10 transform -translate-y-full"
                    style="left: {((year - 1950) / 70) * 100}%"
                >
                    <div class="stack flex -space-x-36">
                        {#each guesses as { track, player, guessedYear }}
                            <NoFlipCard extraClasses="w-40" minimized={true} {track}>
                                <p>{player.name} guessed {guessedYear}.</p>
                            </NoFlipCard>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>