<script lang="ts">
	import { get, ref, getDatabase } from '$lib/firebase';
	import { untrack } from 'svelte';
	import { slide } from 'svelte/transition';
	// @ts-ignore
	import Info from 'virtual:icons/mdi/information-outline';
	// @ts-ignore
	import Pdf from 'virtual:icons/mdi/file-pdf-box';
	// @ts-ignore
	import Chevron from 'virtual:icons/mdi/chevron-down';

	let showCronograma = $state(false);

	let booksArray: any = $state([]);
	let booksShow: any = $state([]);
	let booksReversed: any = $state([]);
	let currentBook: any = $state({});
	let bookModal: any = $state({});
	let oldBooks = $state(false);

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
			booksReversed = [...booksArray].reverse();
			booksShow = booksReversed.slice(0, 4);
		} catch (error) {
			console.error('getBooks failed:', error);
			throw error;
		}
	}

	function loadMore() {
		const nextBatch = booksReversed.slice(booksShow.length, booksShow.length + 4);
		booksShow = [...booksShow, ...nextBatch];
	}
</script>

<div
	class=" flex flex-col gap-2 rounded-3xl border-t border-r border-b border-t-white/50 border-r-white/30 border-b-white/10 bg-linear-30 from-white/5 to-white/30 p-3 shadow shadow-black/20 transition-all"
>
	<h2 class="cool-title px-3 pb-3">Cumbuca Atual</h2>
	{#if currentBook.link}
		<div class="flex w-full justify-center">
			<div
				class="relative flex min-h-70 w-45 items-center justify-center rounded bg-cover bg-center shadow-[0_3px_10px] shadow-black/50"
				style={`background-image: url('/cumbuca/${currentBook.link}.jpg');`}
			>
				<div
					class="absolute flex h-full min-h-full w-full items-center justify-center gap-2 rounded bg-black/30 text-2xl opacity-0 transition-all hover:opacity-100"
				>
					<button
						onclick={() => console.log(currentBook)}
						class="cursor-pointer transition-all hover:scale-110"
					>
						<Info />
					</button>
					<button class="cursor-pointer transition-all hover:scale-110">
						<Pdf />
					</button>
				</div>
			</div>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p class="text-center text-2xl font-bold">{currentBook.titulo}</p>
			<p class="text-base opacity-50">{currentBook.autor}, {currentBook.ano}</p>
		</div>
	{/if}

	<div class="flex flex-col">
		<p class="text-center font-['Grifter'] tracking-wider opacity-85">Cronograma</p>
		{#if showCronograma}
			<div transition:slide={{ duration: 200 }}>
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
		{/if}
		<div class="flex w-full items-center justify-center">
			<button
				onclick={() => (showCronograma = !showCronograma)}
				class="cursor-pointer text-2xl transition-all delay-150 duration-500 {showCronograma
					? 'rotate-180'
					: ''}"><Chevron /></button
			>
		</div>
	</div>
</div>

<div class="glass-bg flex flex-col gap-2 p-3">
	<h2 class="cool-title px-3 pb-3">Livros das Cumbucas</h2>
	<div class="grid w-full grid-cols-2 gap-2">
		<!-- for loop -->
		{#each booksShow as book, i}
			<div class="flex flex-col items-center">
				<div
					class="relative flex min-h-[200px] w-[130px] items-center justify-center rounded-xl bg-cover bg-center shadow-md shadow-black/20"
					style={`background-image: url('/cumbuca/${book.link}.jpg');`}
				>
					<div
						class="absolute flex h-full min-h-full w-full items-center justify-center gap-2 rounded-xl bg-black/30 text-2xl opacity-0 transition-all hover:opacity-100"
					>
						<button
							onclick={() => {
								bookModal = book;
								oldBooks = true;
							}}
							class="cursor-pointer transition-all hover:scale-110"
						>
							<Info />
						</button>
						<button class="cursor-pointer transition-all hover:scale-110">
							<Pdf />
						</button>
					</div>
				</div>
				<p class="text-center text-xl font-bold">{book.titulo}</p>
				<p class="text-sm opacity-50">{book.autor}, {book.ano}</p>
			</div>
		{/each}
	</div>

	{#if booksShow.length < booksArray.length}
		<button onclick={loadMore} class="flex w-full justify-center pt-5 pb-2 text-2xl">
			<Chevron class="cursor-pointer" />
		</button>
	{:else}
		<button
			onclick={() => {
				booksShow = booksReversed.slice(0, 4);
			}}
			class="flex w-full cursor-pointer justify-center pt-5 pb-2 text-2xl"
		>
			Fechar
		</button>
	{/if}
</div>

{#if oldBooks}
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-2 bg-black/50"
	>
		<div class="rounded-xl bg-white/10 p-5 backdrop-blur">{bookModal.titulo}</div>
		<button class="bg-accent-500 cursor-pointer rounded-lg p-2" onclick={() => (oldBooks = false)}
			>Fechar</button
		>
	</div>
{/if}
