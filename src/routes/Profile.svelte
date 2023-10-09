<script lang="ts">
    export let extraClasses = ''; // Declare a class prop with a default value of an empty string
</script>

<div class="rounded-full border border-[#EC407A]{extraClasses}">
	
	<slot />
	<!-- This is where the passed-in content will render -->
</div>
