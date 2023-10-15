<script lang="ts">
	import type { TrackData } from '$lib/spotify';
	import { afterUpdate } from 'svelte';
	export let track: TrackData;
	export let flipped: boolean = false;
	export let minimized: boolean;
	export let extraClasses = '';
	export let playFor10Seconds: boolean = false;

	let audio: HTMLAudioElement;
	let countdown: number = 0;
	let prevTrack: TrackData | null = null;
	let flipToShowAnswer: boolean = false;
	let flippedCard: boolean = false;
	let currentTrack: TrackData = track;
	afterUpdate(() => {
		if (track && audio && track !== prevTrack) {
			if (flipToShowAnswer) {
				flippedCard = true;
				setTimeout(() => {
					flippedCard = false;
					currentTrack = track;
				}, 3000);
			}
			else {
				currentTrack = track;
			}
			audio.pause();
			audio.currentTime = 0; // Reset to the beginning
			audio.load();
			if (playFor10Seconds && countdown === 0) {
				playAudioWithCountdown();
			}
			prevTrack = track;
			flipToShowAnswer = true;
		}
	});

	function playAudioWithCountdown() {
		countdown = 3;
		setTimeout(() => {
			const interval = setInterval(() => {
				countdown--;
				console.log(countdown);
				if (countdown === 0) {
					clearInterval(interval);
					playAudioFor10Seconds();
				}
			}, 1000);
		}, 3000);
	}

	function playAudioFor10Seconds() {
		audio.play();
		setTimeout(() => {
			audio.pause();
		}, 10000); // pause after 10 seconds
	}
</script>

<label class="m-2 h-fit swap swap-flip text-9xl pointer-events-none {extraClasses}">
	<input type="checkbox" class="hidden" checked={flippedCard} />
	<!-- This is hidden assuming you do not want the checkbox to show -->
	<div class="swap-on w-full h-full rounded-xl overflow-hidden bg-neutral-900">
		<img src={currentTrack?.image.url} alt="Album Artwork" />
		<div class="text-center pl-2 pr-2 p-4">
			<p class="font-bold text-5xl m-2">{currentTrack.year}</p>
			{#if !minimized}
				<p class="text-lg">
					{currentTrack.name} - <span class="underline">{currentTrack.artists[0]}</span>
				</p>
			{/if}
		</div>
		{#if !minimized}
			<audio bind:this={audio} class="pointer-events-none w-full">
				<source src={track.preview} type="audio/mpeg" />
			</audio>
		{/if}
	</div>
	<div
		class="swap-off w-full h-full rounded-xl overflow-hidden bg-neutral-800 flex flex-col justify-center items-center relative"
	>
		{#if countdown}
			<!-- Overlay for the black tint -->
			<div class="absolute inset-0 bg-black opacity-50" />
			<!-- Countdown Text -->
			<p class="font-bold text-5xl m-2 absolute z-10">{countdown}</p>
		{/if}
		<img src={'src/lib/assets/beatlineBackground.png'} alt="Beatline" class="w-full h-full" />
	</div>
</label>
