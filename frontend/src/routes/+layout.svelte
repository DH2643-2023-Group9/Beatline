<script>
	import { onMount } from 'svelte';
	import './styles.css';
	import '../app.css';
	import Background from './Background.svelte';

	onMount(() => {
		// TODO: Find a better way to redirect mobile visitors to the join game page
		// if (typeof window !== 'undefined' 
		// 	&& window.innerWidth <= 768 
		// 	&& window.location.pathname !== '/joinGame') {
		// 	window.location.href = '/joinGame';
		// }
	});
</script>

<div class="app overflow-hidden">
	{#if typeof window !== 'undefined' && !['/join', '/play'].includes(window.location.pathname)}
		<Background />
	{/if}

	<main>
		<slot />
	</main>

	<footer>
		<p>🎉 Beatline is a cool site 🎉</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		width: 100%;
		box-sizing: border-box;
		pointer-events: none;
		z-index: 1;
		color: white;
	}

	footer {
		position: absolute;
		bottom: 20px;
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 12px;
		z-index: 1;
		pointer-events: none;
		color: white;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
