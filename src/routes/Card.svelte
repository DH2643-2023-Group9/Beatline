<script lang="ts">
    export let extraClasses = ''; // Declare a class prop with a default value of an empty string
</script>

<div class="card border border-[#EC407A] shadow-2xl p-8 bg-[#272727] rounded-xl text-white font-mono${extraClasses} min-w-[1000px]">
	
	<slot />
	<!-- This is where the passed-in content will render -->
</div>
