<script lang="ts">
	import type { Team } from "$models/game";

    export let teams: Team[];

    let winner = '';
    if (teams[0].score > teams[1].score) {
        winner = teams[0].name;
    } else if (teams[1].score > teams[0].score) {
        winner = teams[1].name;
    } else {
        winner = 'It\'s a tie!';
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen  space-y-8">
    <!-- Winner Announcement -->
    <div class="text-3xl font-bold text-blue-600">
        {#if winner !== 'It\'s a tie!'}
            Winner: {winner} 🎉
        {:else}
            {winner}
        {/if}
    </div>

    <!-- Scoreboard -->
    <div class="flex space-x-8">
        <!-- Team Red Score -->
        <div class="flex flex-col items-center p-4 bg-slate-600 rounded-lg shadow-md space-y-4">
            <div class="text-xl font-semibold text-red-500">
                {teams[0].name}
            </div>
            <div class="text-2xl">
                Score: {teams[0].score}
            </div>
        </div>

        <!-- Team Blue Score -->
        <div class="flex flex-col items-center p-4 bg-slate-600 rounded-lg shadow-md space-y-4">
            <div class="text-xl font-semibold text-blue-500">
                {teams[1].name}
            </div>
            <div class="text-2xl">
                Score: {teams[1].score}
            </div>
        </div>
    </div>

    <!-- Restart Button -->
    <button class="btn btn-primary">
        Restart Game
    </button>
</div>
