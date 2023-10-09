<script>
    export let playerName = "";  // Accept the player name as a prop
</script>

<!-- Styling for the Waiting Screen -->
<style>
    /* You can add any additional custom styles here if needed */
</style>

<!-- Main Content of the Waiting Screen -->
<div class="flex flex-col items-center justify-center h-screen p-4 md:p-8"> 
    <!-- Background color can be changed based on your preference -->
    
    <h1 class="text-2xl md:text-4xl mb-4 ">Welcome, {playerName}!</h1>
    
    <div class="text-center">
        <p class="">You have successfully joined the game room.</p>
        <p class="">Waiting for the game to start...</p>
        
        <!-- Optional: You can add a spinner or any loading animation below -->
        <!-- <div class="spinner mt-6"></div> -->
    </div>
</div>
