<!-- Timeline.svelte -->

<script lang="ts">
    import type { Team } from '$models/game';
    import NoFlipCard from './NoFlipCard.svelte';

    export let team: Team;
    export let swap: 'off' | 'on';

    let translate = '';
    $: if (swap === 'on') {
        translate = '-translate-y-8';
    }

    $: timelineLength = team.timeline.length;
</script>

<div class="swap-{swap} relative w-full h-auto mx-auto">
    <div class="flex items-center justify-center p-4 {translate}">
        <div class="relative w-3/4 h-auto mx-auto">
            <!-- Render the timeline line only if more than one card -->
            <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-300" />
                {#each team.timeline as { year, guesses }, index}
                    <div
                        class="absolute top-1/2 transform -translate-y-1/2 text-center"
                        style="left: {(index / (timelineLength - 1)) * 100}%"
                    >
                        <div class="w-1 h-4 bg-gray-300 dark:bg-gray-300 rounded-full" />
                    </div>
                {/each}
            {#each team.timeline as { year, guesses }, index}
                <div
                    class="absolute -top-10 transform -translate-y-full"
                    style="left: {(timelineLength === 1) ? '50%' : (index / (timelineLength - 1)) * 100-8}%"
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
