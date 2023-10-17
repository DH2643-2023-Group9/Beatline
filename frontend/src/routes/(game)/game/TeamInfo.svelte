<script lang="ts">
	import Profile from '../../Profile.svelte';
    import type { Team } from '$models/game';
    export let team: Team;
    type GradientColors = [string, string, string];
    export let gradientColors: GradientColors;
</script>

<div
    class="rounded-md p-1 space-x-6 space-y-6"
    style="background: linear-gradient(90deg, {gradientColors[0]}, {gradientColors[1]}, {gradientColors[2]})"
>
    <div class="h-full w-full bg-gray-800">
        <h2>{team.name}</h2>
        <p>Score: {team.score}</p>

        <Profile extraClasses="mb-2 border-none">
            {#each team.players as player}
                <div class="flex flex-wrap content-end">{player.name}</div>
                {#if player.image.defaultId}
                    <img
                        src={`avatars/${player.image.defaultId}.webp`}
                        alt="Avatar"
                        class="w-8 h-8 rounded-full"
                    />
                {:else if player.image.data}
                    <img src={player.image.data} alt="Avatar" class="w-8 h-8 rounded-full" />
                {/if}
            {/each}
        </Profile>
    </div>
</div>
