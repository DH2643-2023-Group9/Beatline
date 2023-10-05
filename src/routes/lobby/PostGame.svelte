<script lang="ts">
    interface Team {
		name: string;
		players: string[];
		score: number;
	}
    export let teamRed: Team;
    export let teamBlue: Team;

    let winner = '';
    if (teamRed.score > teamBlue.score) {
        winner = teamRed.name;
    } else if (teamBlue.score > teamRed.score) {
        winner = teamBlue.name;
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
                {teamRed.name}
            </div>
            <div class="text-2xl">
                Score: {teamRed.score}
            </div>
        </div>

        <!-- Team Blue Score -->
        <div class="flex flex-col items-center p-4 bg-slate-600 rounded-lg shadow-md space-y-4">
            <div class="text-xl font-semibold text-blue-500">
                {teamBlue.name}
            </div>
            <div class="text-2xl">
                Score: {teamBlue.score}
            </div>
        </div>
    </div>

    <!-- Restart Button -->
    <button class="btn btn-primary">
        Restart Game
    </button>
</div>
