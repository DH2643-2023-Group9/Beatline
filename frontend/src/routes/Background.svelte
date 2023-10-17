<script lang="ts">
	//depending on the screen width and height, the number of rows and columns will change
	let rows = 0;
	let columns = 0;

	let windowWidth = window.innerWidth;

	rows = Math.floor(window.innerHeight / 100);
	columns = Math.floor(windowWidth / 100);

	//if the screen is resized, the number of rows and columns will change
	window.addEventListener('resize', () => {
		windowWidth = window.innerWidth;

		rows = Math.floor(window.innerHeight / 100);
		columns = Math.floor(windowWidth / 100);

		tiles = Array(rows * columns).fill(0);
	});
	let tiles = Array(rows * columns).fill(0);
</script>

<div id="tiles">
	{#each tiles as _, index}
		<div
			class="tile"
			style="
				grid-column: {(index % columns) + 1} / {(index % columns) + 2};
				grid-row: {Math.floor(index / columns) + 1} / {Math.floor(index / columns) + 2};
			"
		/>
	{/each}
</div>

<style>
	:root {
		--g1: rgb(98, 0, 234);
		--g2: rgb(236, 64, 122);
		--g3: rgb(255, 174, 0);
	}

	@keyframes background-pan {
		from {
			background-position: 0% center;
		}

		to {
			background-position: -200% center;
		}
	}

	#tiles {
		height: calc(100vh - 1px);
		width: calc(100vw - 1px);
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: repeat(1fr, 1fr);
		grid-template-rows: repeat(1fr, 1fr);
		animation: background-pan 10s linear infinite;
		background: linear-gradient(to right, var(--g1), var(--g2), var(--g3), var(--g1));
		background-size: 200%;
		height: 100vh;
		overflow: hidden;
		margin: 0px;
		position: fixed;
		z-index: 0;
		pointer-events: all;
		--tile-color: rgb(35, 35, 35);
	}

	.tile {
		cursor: pointer;
		position: relative;
	}

	.tile:hover:before {
		inset: 10%;
		transition: inset 100ms ease-in-out;
		cursor: default;
	}

	.tile:before {
		background-color: var(--tile-color);
		content: '';
		inset: 2%;
		position: absolute;
		transition: inset 1s ease-in-out;
		box-shadow: 0 0 5px 1px rgb(0, 0, 0, 0.5);
	}
</style>
