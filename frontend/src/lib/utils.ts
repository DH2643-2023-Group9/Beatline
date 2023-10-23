import type { ProfileImage } from "$models/game";

/**
 * @returns an array of numbers from `start` to `stop` (inclusive) with `step` increments.
 */
export function range(start: number, stop: number, step = 1): number[] {
	return Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);
}

let randomAvatarId = Math.floor(Math.random() * 1000);

export function parsePlayerImage(image: ArrayBuffer | undefined): ProfileImage {
	if (!image) {
		randomAvatarId = (randomAvatarId + 1) % 10;
		return {defaultId: randomAvatarId};
	}
	return {data: URL.createObjectURL(new Blob([new Uint8Array(image)]))}
}