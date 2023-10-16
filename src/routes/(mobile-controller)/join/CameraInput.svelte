<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	export let imageBytes: Uint8Array | undefined;
	const MAX_SIZE = 512;
	const COMPRESSION_QUALITY = 0.8;
	let fileInput;

	function resizeAndCompressImage(file: File): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				let width = img.width;
				let height = img.height;

				// Calculate new dimensions if necessary to fit within MAX_SIZE
				const maxDim = Math.max(width, height);
				if (maxDim > MAX_SIZE) {
					width *= MAX_SIZE / maxDim;
					height *= MAX_SIZE / maxDim;
				}

				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				if (!ctx) {
					reject('Could not get canvas context');
					return;
				}
				ctx.drawImage(img, 0, 0, width, height);
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject('Could not convert canvas content to blob');
							return;
						}
						resolve(blob);
					},
					'image/jpeg',
					COMPRESSION_QUALITY
				); // Convert canvas content to JPEG with specified quality
			};
			img.onerror = reject;
		});
	}

	const handleCapture: ChangeEventHandler<HTMLInputElement> = async (event) => {
		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		const file = target.files[0];
		if (file) {
			try {
				const resizedCompressedBlob = await resizeAndCompressImage(file);
				const reader = new FileReader();
				reader.onload = function (e) {
					const result = e.target?.result;
					if (!result) return;
					imageBytes = new Uint8Array(result as ArrayBuffer);
				};
				reader.readAsArrayBuffer(resizedCompressedBlob);
			} catch (err) {
				console.error('Error resizing and compressing the image:', err);
			}
		}
	};
</script>

<label class="block mb-2 text-lg">
	Take a Picture 😎:
	<input
		class="pointer-events-auto file-input file-input-primary mb-2 text-black"
		bind:this={fileInput}
		type="file"
		accept="image/*"
		capture={true}
		on:change={handleCapture}
	/>
</label>
