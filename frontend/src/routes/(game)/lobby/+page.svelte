<script lang="ts">
	import { getContext } from 'svelte';
	import type { MainContext } from '../+layout.svelte';
	import { goto } from '$app/navigation';
	import Card from '../../Card.svelte';
	import Modal from '../../Modal.svelte';
	import { getPlayListData, getPlaylistId } from '$lib/spotify';
	import { accessToken } from '$stores/tokenStore';
	import GameSettings from './GameSettings.svelte';
	import LobbyHeader from './LobbyHeader.svelte';
	import { parsePlayerImage } from '$lib/utils';

	const { socket, roomId, gameModel } = getContext<MainContext>('main');

	if (gameModel.isActive) {
		const msg = 'You dun goofed. The game is already start';
		alert(msg);
		goto('/');
	}

	let teams = gameModel.teams;
	let limit = gameModel.limit;
	let limitType = gameModel.limitType;
	let interval = [1960, 2020];
	let playlistInput = '';
	let difficulty = gameModel.difficulty;

	socket.on('createRoom', (data) => {
		$roomId = data.roomId;
	});

	socket.on('joinRoom', ({ name, userId, image }) => {
		const host = gameModel.numberOfPlayers() === 0;
		gameModel.addPlayer({
			name,
			id: userId,
			host: host,
			abilities: [],
			image: parsePlayerImage(image),
		});
		if (host) {
			socket.emit('assignHost', { userId });
		}
		teams = gameModel.teams;
	});

	socket.on('playerDisconnected', ({ userId }) => {
		gameModel.removePlayer(userId);
		teams = gameModel.teams;
	});

	socket.on('joinTeam', ({ team, userId }) => {
		gameModel.switchTeam(userId, team);
		teams = gameModel.teams;
	});

	socket.on('startGame', () => {
		startGame();
	});

	function startGame() {
		if (gameModel.teams.map((t) => t.players.length).some((n) => n < 1)) {
			alert('You need at least 2 players to start the game');
			return;
		}
		if (interval[0] >= interval[1]) {
			alert('Invalid interval');
			return;
		}
		interval[1] = Math.min(interval[1], new Date().getFullYear());
		gameModel.interval = interval;
		gameModel.setLimit(limit, limitType);
		gameModel.isActive = true;
		socket.emit('startGame');
		goto('/game');
	}

	async function startWithPlaylist() {
		let playlistId;
		try {
			playlistId = await getPlaylistId(playlistInput);
			if (!$accessToken) {
				const err = 'Missing Spotify access token';
				alert(err);
				goto('/spotify/newToken');
				return;
			}
		} catch (err) {
			alert(`Invalid playlist link: '${playlistInput}'`);
			return;
		}
		const playlist = await getPlayListData(playlistId, $accessToken);
		gameModel.setPlaylist(playlist);
		startGame();
	}

	socket.emit('createRoom', { roomId: $roomId });
</script>

<div class="min-h-screen flex flex-col">
	<LobbyHeader roomId={$roomId} />
	<!-- Center the content vertically -->
	<div class="flex-grow flex items-center justify-center">
		<!-- Added w-full and items-start -->
		<div class="flex justify-center items-start">
			<!-- Left Side (Players List) -->
			<div class="w-1/3 flex p-6">
				<Card extraClasses="min-w-[300px] rounded-xl">
					{#each teams as { players, name }}
						<div>
							<h2 class="text-xl font-semibold mb-4">{name}</h2>
							{#each players as player}
								<div class="mb-2 flex flex-row space-x-2 items-center">
									<span>{player.host ? '👑' : ''}</span>
									<span>{player.name}</span>
									{#if player.image.defaultId !== undefined}
										<img
											src={`avatars/${player.image.defaultId}.webp`}
											alt="Avatar"
											class="w-8 h-8 rounded-full"
										/>
									{:else if player.image.data}
										<img src={player.image.data} alt="Avatar" class="w-8 h-8 rounded-full" />
									{/if}
								</div>
							{/each}
						</div>
					{/each}
				</Card>
			</div>

			<!-- Right Side (Settings) -->
			<div class="w-2/3 p-6">
				<!-- Settings -->
				<Card extraClasses="min-w-[700px] rounded-xl space-y-4 flex flex-col">
					<div class="w-full space-y-4">
						<GameSettings bind:limit bind:limitType bind:interval bind:difficulty />
						<button
							on:click={startGame}
							class="pointer-events-auto btn btn-info w-full text-white bg-gradient-to-r from-[#6200EA] via-[#EC407A] to-[#ffae00] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
							>Start Game</button
						>
					</div>
					<div class="divider before:bg-neutral after:bg-neutral">OR</div>
					<div class="w-full flex flex-row justify-center">
						<input
							type="text"
							class="pointer-events-auto input input-bordered text-black join-item w-1/2 mr-4"
							placeholder="Enter a Spotify playlist ID / link"
							bind:value={playlistInput}
						/>
						<button
							class="pointer-events-auto btn btn-info text-white bg-gradient-to-r from-[#6200EA] via-[#EC407A] to-[#ffae00] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-r-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
							on:click={startWithPlaylist}>Start With Playlist</button
						>
					</div>
				</Card>
			</div>
		</div>
	</div>

	<!-- Other content below the flex container -->
	<!-- ... your other content ... -->
</div>

<style>
	/* You can add any additional styles or override default Tailwind styles here */
	:root {
		--range-slider: hsl(var(--s));
		--range-handle-inactive: hsl(0, 0%, 99%);
		--range-handle: hsl(var(--sc));
		--range-handle-focus: hsl(var(--sf));
		--range-handle-border: hsl(var(--sc));
		--range-range-inactive: hsl(var(--s));
		--range-range: hsl(244.1, 63.2%, 54.1%);
		--range-float-inactive: hsl(180, 4.6%, 61.8%);
		--range-float: hsl(244.1, 63.2%, 54.1%);
		--range-float-text: hsl(0, 0%, 100%);

		--range-pip: hsl(210, 14.3%, 53.3%);
		--range-pip-text: hsl(210, 14.3%, 53.3%);
		--range-pip-active: hsl(180, 25.4%, 24.7%);
		--range-pip-active-text: hsl(180, 25.4%, 24.7%);
		--range-pip-hover: hsl(180, 25.4%, 24.7%);
		--range-pip-hover-text: hsl(180, 25.4%, 24.7%);
		--range-pip-in-range: hsl(180, 25.4%, 24.7%);
		--range-pip-in-range-text: hsl(180, 25.4%, 24.7%);
	}
</style>
