<script lang="ts">
	import { get, ref, getDatabase } from '$lib/firebase';
	import { untrack } from 'svelte';

	// @ts-ignore
	import Dots from 'virtual:icons/mdi/dots-horizontal';

	let booksArray: any = $state([]);
	let booksShow: any = $state([]);
	let currentBook: any = $state({});

	$effect(() => {
		untrack(async () => {
			await getBooks();
		});
	});
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
			booksShow = booksArray.reverse();
		} catch (error) {
			console.error('getBooks failed:', error);
			throw error;
		}
	}
</script>

<div class="flex flex-col gap-2 rounded-lg border p-5">
	<h2 class="pb-3">Cumbuca Atual</h2>
	<div class="flex w-full justify-center">
		<div class="flex min-h-70 w-45 items-center justify-center rounded bg-rose-700">
			<span class="-rotate-45">Capa</span>
		</div>
	</div>
	<div class="flex flex-col items-center justify-center">
		<p class="text-center text-2xl font-bold">{currentBook.titulo}</p>
		<p class="text-base opacity-50">{currentBook.autor}, {currentBook.ano}</p>
	</div>

	<div>
		<p>Cronograma</p>
		<ul class="flex w-full flex-col items-center justify-center">
			<li class="flex w-full max-w-[30ch] justify-between">
				<span>Cap. 1</span>&bull;<span>15 págs</span>&bull;<span>01/02</span>
			</li>
			<li class="flex w-full max-w-[30ch] justify-between opacity-50">
				<span>Cap. 2</span>&bull;<span>20 págs</span>&bull;<span>10/02</span>
			</li>
			<li class="flex w-full max-w-[30ch] justify-between opacity-50">
				<span>Cap. 3</span>&bull;<span>23 págs</span>&bull;<span>20/02</span>
			</li>
			<li class="flex w-full max-w-[30ch] justify-between opacity-50">
				<span>Cap. 4 & 5</span>&bull;<span>18 págs</span>&bull;<span>28/02</span>
			</li>
			<li class="flex w-full max-w-[30ch] justify-between opacity-50">
				<span>Cap. 6</span>&bull;<span>12 págs</span>&bull;<span>10/03</span>
			</li>
		</ul>
	</div>
</div>

<div class="flex flex-col gap-2 rounded-lg border p-5">
	<h2 class="pb-3">Cumbucas Passadas</h2>
	<div class="grid w-full grid-cols-2 gap-2">
		<!-- for loop -->
		{#each booksShow as book}
			<div class="flex flex-col items-center">
				<div class="flex min-h-[200px] w-[130px] items-center justify-center rounded bg-green-400">
					Capa
				</div>
				<p class="text-xl font-bold">{book.titulo}</p>
				<p class="text-sm opacity-50">{book.autor}, {book.ano}</p>
			</div>
		{/each}
	</div>
	<button
		onclick={() => console.log('do the whole array or something')}
		class="flex w-full justify-center pt-5 pb-2 text-2xl"
	>
		<Dots class="cursor-pointer" />
	</button>
</div>
