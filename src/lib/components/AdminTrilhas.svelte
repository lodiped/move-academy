<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { database } from '$lib/firebase';
	import { slide } from 'svelte/transition';
	import { isAdmin } from '$lib/state.svelte';
	import { get, ref, child } from 'firebase/database';

	import Chevron from 'virtual:icons/mdi/chevron-down';
	import Gear from 'virtual:icons/mdi/gear';
	import Trash from 'virtual:icons/mdi/trash-can-outline';
	import Save from 'virtual:icons/mdi/content-save';

	let addVideoLink = $state('');
	let addVideoTitle = $state('');
	let addVideoAuthor = $state('');

	let deleteModal = $state(false);

	let trilhas: any = $state([]);
	let trilhaList = $state([false, false, false]);
	let showTrilhas = $state(false);
	let addTrilha = $state(false);
	let addTrilhaTitle = $state('');
	let addTrilhaDesc = $state('');
	let newTrilhaSectors: string[] = $state([]);
	let sectorIdx: number | undefined = $state();

	let treinamentos = $state([]);
	let sectors: string[] = $state(['', 'bpo', 'contabil', 'geral']);

	let unsavedChanges = $state(false);

	function handleBeforeUnload(e: BeforeUnloadEvent) {
		if (unsavedChanges) {
			e.preventDefault();
			e.returnValue = '';
			return 'Você tem alterações pendentes. Tem certeza que deseja sair?';
		}
	}

	////////////////////

	function toggleTrilhaList(idx: number) {
		trilhaList[idx] = !trilhaList[idx];
	}
	function checkLocalStorage() {
		if (localStorage.trilhas) {
			return true;
		} else {
			return false;
		}
	}

	function getTrilha() {
		if (!checkLocalStorage()) {
			get(child(ref(database), 'trilhasproper'))
				.then((snapshot) => {
					if (snapshot.exists()) {
						trilhas = snapshot.val();
						localStorage.trilhas = JSON.stringify(trilhas);
						console.log('trilhasPROPERRRRRR ', trilhas);
					} else {
						console.log('No data available');
					}
				})
				.catch((err) => console.error(err));
		} else {
			trilhas = JSON.parse(localStorage.trilhas);
		}
	}

	////////////////////

	onMount(() => {
		window.addEventListener('beforeunload', handleBeforeUnload);

		const layout = localStorage.getItem('exhibition');
		if (isAdmin && !treinamentos.length) {
			get(child(ref(database), 'trilhas'))
				.then((snapshot) => {
					if (snapshot.exists()) {
						trilhas = snapshot.val();
						altTrilhas = JSON.parse(JSON.stringify(trilhas));
						console.log('TRILHAAAS', trilhas);
					} else {
						console.log('No data available');
					}
				})
				.catch((err) => console.error(err));
		} else {
			goto('/');
			return;
		}
	});

	onDestroy(() => {
		window.removeEventListener('beforeunload', handleBeforeUnload);
	});

	function checkaltTrilhas() {
		console.log(altTrilhas);
		console.log(trilhas);
		console.log(trilhas === altTrilhas);
	}

	let altTrilhas: any = [];

	function deepEqual(a: any, b: any) {
		return JSON.stringify(a) === JSON.stringify(b);
	}

	$effect(() => {
		// Checar constantemente se houve alterações ao editar as trilhas.
		// ou seja, salvar o estado original ao carregar, e esperar as alterações em outras vars.
		unsavedChanges = !deepEqual(trilhas, altTrilhas);
	});
	// TODO Colocar ações nos HTML buttons em um faux var (altTrilhas) para o effect ler e comparar
</script>

<div
	class="glass-bg flex w-full max-w-[80ch] flex-col items-center gap-2 rounded-3xl p-4 transition-all"
>
	<button onclick={() => (showTrilhas = !showTrilhas)} class="relative cursor-pointer">
		<h2 class="cool-title">Trilhas</h2>
		<div class="absolute -right-10 bottom-0 h-full cursor-pointer">
			<Chevron class="text-3xl transition-all {showTrilhas ? 'rotate-180' : ''}" />
		</div>
	</button>
	{#if showTrilhas}
		<div class="flex w-full flex-col items-center gap-2 p-4" transition:slide>
			<div class="flex w-full flex-col items-center gap-2">
				<button onclick={checkaltTrilhas}>Console Log</button>
				{#each trilhas as trilha, i}
					<div class="group/button w-full">
						<button
							class="group/button relative w-full cursor-pointer py-4 transition-all {trilhaList[i]
								? 'inset-button'
								: 'high-button'}"
							onclick={() => (trilhaList[i] = !trilhaList[i])}
						>
							<span
								class="cool-title font-['Grifter'] text-xl uppercase transition-all group-hover/button:drop-shadow-[0_0_3px_white]/50"
								>{trilha.titulo}</span
							>
							<div
								class="absolute top-0 right-5 flex h-full cursor-pointer items-center transition-transform {trilhaList[
									i
								]
									? 'rotate-180'
									: ''}"
							>
								<Chevron class="text-3xl" />
							</div>
						</button>
					</div>
					{#if trilhaList[i]}
						<div transition:slide class="mb-5 flex w-full flex-col">
							{#each trilha.videos as video, i}
								<div
									class="border-bottom flex items-center justify-between gap-2 border-b border-white/20 p-2 last:border-b-0"
								>
									<span class="cool-title w-[1.5ch] text-center font-['Grifter'] text-xl"
										>{i + 1}</span
									>
									<div class="flex gap-1">
										<button
											onclick={() => {
												// swap item with previous
												trilha.videos[i] = trilha.videos[i - 1];
												trilha.videos[i - 1] = video;
											}}
											class="button-base p-1 {i === 0 ? 'opacity-50' : ''}"
											><Chevron class="rotate-180 text-xl" /></button
										>
										<button
											class="button-base p-1"
											onclick={() => {
												// swap item with next
												trilha.videos[i] = trilha.videos[i + 1];
												trilha.videos[i + 1] = video;
											}}><Chevron class="text-xl" /></button
										>
									</div>
									<span class="w-full text-left">{video.titulo}</span>
									<div class="flex w-[12ch] gap-1">
										<button class="button-base p-1.5"><Gear /></button>
										<button
											class="button-base bg-rose-500 p-1.5 text-white hover:bg-white hover:text-red-400"
											onclick={() => {
												deleteModal = true;
											}}><Trash /></button
										>
									</div>
								</div>
							{/each}
							{#if unsavedChanges}
								<div class="flex items-center justify-end gap-2">
									<p class="text-red-500">Alterações não salvas!</p>
									<button class="button-base w-fit text-right">Salvar</button>
								</div>
							{/if}
						</div>
					{/if}
				{/each}
				<button onclick={() => (addTrilha = true)} class="button-base w-fit"
					>Adicionar Trilha +</button
				>
			</div>
		</div>
	{/if}
</div>

{#if addTrilha}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-2 bg-black/50"
		onclick={() => {
			addTrilha = false;
			addTrilhaDesc = '';
			addTrilhaTitle = '';
			newTrilhaSectors = [];
		}}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="flex flex-col gap-6 rounded-2xl bg-white/10 p-5 backdrop-blur"
		>
			<div class="flex flex-col gap-2">
				<div>
					<input
						type="text"
						name="titulo"
						id="titulo"
						class="rounded-lg bg-white/10 placeholder:text-white/50"
						placeholder="Título da Trilha"
						bind:value={addTrilhaTitle}
					/>
				</div>
				<div>
					<input
						type="text"
						name="descricao"
						id="descricao"
						class="rounded-lg bg-white/10 placeholder:text-white/50"
						placeholder="Descrição da Trilha"
						bind:value={addTrilhaDesc}
					/>
				</div>
				<select
					name="sector"
					id="sector"
					placeholder="Setor"
					class="rounded-lg bg-white/10 placeholder:text-white/50"
					bind:value={sectorIdx}
					onchange={() => {
						if (sectorIdx! > 0) {
							if (newTrilhaSectors.length) {
								for (let i = 0; i < newTrilhaSectors.length; i++) {
									if (newTrilhaSectors[i] === sectors[sectorIdx!]) {
										newTrilhaSectors.splice(i, 1);
									}
								}
								newTrilhaSectors.sort();
							}
							if (sectors[sectorIdx!]) {
								newTrilhaSectors.push(sectors[sectorIdx!]);
								newTrilhaSectors.sort();
							}
						}
					}}
				>
					{#each sectors as sector, i}
						<option class="text-black" value={i}>{sector}</option>
					{/each}
				</select>
				{#if newTrilhaSectors.length}
					<div class="flex gap-1">
						{#each newTrilhaSectors as sector, i}
							<button
								class="w-fit rounded-full bg-white/10 p-1 px-3 text-sm"
								onclick={() => {
									newTrilhaSectors.splice(i, 1);
									newTrilhaSectors.sort();
								}}>{sector}</button
							>
						{/each}
					</div>
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<button
					disabled={!addVideoLink || !addVideoTitle || !addVideoAuthor}
					onclick={() => {
						const newTrilha = {
							titulo: addTrilhaTitle,
							descricao: addTrilhaDesc,
							sector: newTrilhaSectors
						};
						const newVideo = {
							link: addVideoLink,
							titulo: addVideoTitle,
							autor: addVideoAuthor
						};
						trilhas = [...trilhas, newTrilha];
						addTrilha = false;
					}}
					class="button-base disabled:pointer-events-none disabled:opacity-50">Salvar</button
				>
				<button
					onclick={() => {
						addTrilhaDesc = '';
						addTrilhaTitle = '';
						newTrilhaSectors = [];
						addTrilha = false;
					}}
					class="button-base bg-transparent text-white hover:bg-white hover:text-black"
					>Cancelar</button
				>
			</div>
		</div>
	</div>
{/if}

{#if deleteModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-2 bg-black/50"
		onclick={() => (deleteModal = false)}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="flex flex-col items-center gap-6 rounded-xl bg-white/10 p-5 backdrop-blur"
		>
			<h2>Tem certeza?</h2>
			<p>Deseja excluir este vídeo da trilha?</p>
			<div class="flex gap-2">
				<button
					onclick={() => {
						deleteModal = false;
					}}
					class="button-base">Sim <Save /></button
				>
				<button
					onclick={() => {
						deleteModal = false;
					}}
					class="button-base bg-transparent text-white hover:bg-white hover:text-black"
					>Cancelar</button
				>
			</div>
		</div>
	</div>
{/if}
