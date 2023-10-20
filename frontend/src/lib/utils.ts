
/**
 * @returns an array of numbers from `start` to `stop` (inclusive) with `step` increments.
 */
export function range(start: number, stop: number, step = 1): number[] {
	return Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);
}
