<script lang="ts">
	import { get, ref, getDatabase } from '$lib/firebase';

	let booksArray: any = $state([]);
	let currentBook = $state({});

	async function getBooks() {
		try {
			const response = await get(ref(getDatabase(), '/cumbuca'));
			if (!response.exists()) {
				throw new Error("Couldn't get data at /cumbuca");
			}
			let snap = response.val();
			const { livros, currentCumbuca } = snap;

			if (!livros || typeof livros !== 'object') {
				console.error(livros);
				throw new Error('livros is not an object');
			}
			booksArray = Object.entries(livros).map(([key, value]) => {
				return value;
			});

			if (Number.isInteger(currentCumbuca) === false || currentCumbuca > booksArray.length - 1) {
				console.error(currentCumbuca);
				throw new Error('currentCumbuca is not an integer or out of range');
			}
			const idx = currentCumbuca;
			currentBook = booksArray[idx];
		} catch (error) {
			console.error('getBooks failed:', error);
			throw error;
		}
	}
	$inspect(currentBook);
	$inspect(booksArray);
</script>

<button onclick={getBooks}>Hit</button>
