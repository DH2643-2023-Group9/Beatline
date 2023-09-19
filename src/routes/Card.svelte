<script lang="ts">
    export let extraClasses = ''; // Declare a class prop with a default value of an empty string
</script>

<div class="card bordered shadow-2xl p-8 bg-white rounded-xl text-black ${extraClasses}">
	<slot />
	<!-- This is where the passed-in content will render -->
</div>
