<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { database } from '$lib/firebase';
	import { slide } from 'svelte/transition';
	import { isAdmin } from '$lib/state.svelte';
	import { get, ref, child } from 'firebase/database';

	import Chevron from 'virtual:icons/mdi/chevron-down';
	import List from 'virtual:icons/mdi/format-list-bulleted';
	import Square from 'virtual:icons/mdi/grid-large';
	import Trash from 'virtual:icons/mdi/trash-can-outline';
	import Add from 'virtual:icons/mdi/plus-thick';
	let addVideo = $state(false);
	let addVideoLink = $state('');
	let addVideoTitle = $state('');
	let addVideoAuthor = $state('');

	let trilhas: any = $state([]);
	let trilhaList = $state([false, false, false]);
	let exhibition = $state('list');
	let showTrilhas = $state(false);
	let addTrilha = $state(false);
	let addTrilhaTitle = $state('');
	let addTrilhaDesc = $state('');
	let newTrilhaSectors: string[] = $state([]);
	let sectorIdx: number | undefined = $state();

	let treinamentos = $state([]);
	let sectors: string[] = $state(['', 'bpo', 'contabil', 'geral']);

	onMount(() => {
		const layout = localStorage.getItem('exhibition');
		exhibition = layout ? layout : 'grid';
		if (isAdmin && !treinamentos.length) {
			get(child(ref(database), 'trilhas'))
				.then((snapshot) => {
					if (snapshot.exists()) {
						trilhas = snapshot.val();
						console.log(trilhas);
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
			<div class="flex w-full items-center gap-2">
				<span>Exibição:</span>
				<button onclick={() => (exhibition = 'list')} class="cursor-pointer"><List /></button>
				<button onclick={() => (exhibition = 'grid')} class="cursor-pointer"><Square /></button>
			</div>
			<div class="flex w-full flex-col gap-2">
				{#each trilhas as trilha, i}
					<div class="group/button">
						<button
							class="group/button relative w-full cursor-pointer py-4 transition-all {trilhaList[i]
								? 'inset-button'
								: 'high-button'}"
							onclick={() => (trilhaList[i] = !trilhaList[i])}
						>
							<span
								class="cool-title-negative font-['Grifter'] text-xl uppercase transition-all group-hover/button:drop-shadow-[0_0_3px_white]/50"
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
						<div transition:slide class="flex w-full flex-col gap-2">
							{#each trilha.videos as video, i}
								<div class=" flex justify-between gap-2 rounded border border-white/10 p-2">
									<span class="cool-title w-[1.5ch] text-center font-['Grifter'] text-xl"
										>{i + 1}</span
									>
									<span class="w-full text-left">{video.titulo}</span>
									<div class="flex w-[12ch] gap-0.5">
										<button class="rounded bg-slate-700 px-2 {i === 0 ? 'opacity-50' : ''}"
											>/\</button
										>
										<button class="rounded bg-slate-700 px-2">\/</button>
										<button class="rounded bg-slate-700 px-1 hover:text-red-500"><Trash /></button>
									</div>
								</div>
							{/each}
							<div class="flex justify-end">
								<button class="button-base w-fit text-right">Salvar</button>
							</div>
						</div>
					{/if}
				{/each}
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
			class="flex flex-col gap-6 rounded-xl bg-white/10 p-5 backdrop-blur"
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
				<div>
					<input
						type="text"
						class="rounded-lg bg-white/10 placeholder:text-white/50"
						name="autor"
						id="autor"
						placeholder="Autor do Vídeo"
						bind:value={addVideoAuthor}
					/>
				</div>
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
					class="button-base border border-white bg-transparent text-white hover:bg-white hover:text-black"
					>Cancelar</button
				>
			</div>
		</div>
	</div>
{/if}
