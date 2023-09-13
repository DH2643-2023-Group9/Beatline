<script>
	import './styles.css';
	import '../app.css';
	import Background from './Background.svelte';
</script>

<div class="app">
	{#if typeof window !== 'undefined'}
		<Background />
	{/if}
	<main>
		<slot />
	</main>

	<footer>
		<p>Beatline™ is a registered trademark.</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
		pointer-events: none;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
