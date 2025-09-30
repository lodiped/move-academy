<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAdmin, currentUsername } from '$lib/state.svelte';
	import { auth, child, get, ref } from '$lib/firebase';
	import { database } from '$lib/firebase';

	import Wrench from 'virtual:icons/mdi/wrench';
	import Chevron from 'virtual:icons/mdi/chevron-down';
	import Switch from 'virtual:icons/mdi/autorenew';
	import Trash from 'virtual:icons/mdi/trash-can-outline';
	import Gear from 'virtual:icons/mdi/gear';
	import Add from 'virtual:icons/mdi/plus-thick';
	import Square from 'virtual:icons/mdi/grid-large';
	import List from 'virtual:icons/mdi/format-list-bulleted';
	import { slide } from 'svelte/transition';

	let treinamentos: any = $state([]);
	let treinamentosOrdered: any = $state('');
	let treinamentosOrder = $state('');
	let exhibition = $state('list');

	let trilhas: any = $state([]);
	let trilhaList = $state([false, false, false]);

	let showTreinamentos = $state(false);
	let showTrilhas = $state(false);
	let showUsers = $state(false);
	let showCumbuca = $state(false);

	let addVideo = $state(false);
	let addVideoLink = $state('');
	let addVideoTitle = $state('');
	let addVideoAuthor = $state('');

	let addTrilha = $state(false);
	let addTrilhaTitle = $state('');
	let addTrilhaDesc = $state('');
	let newTrilhaSectors: string[] = $state([]);

	let sectorIdx: number | undefined = $state();

	let sectors: string[] = $state(['', 'bpo', 'contabil', 'geral']);

	function handleVideoOrder(order: string) {
		if (order === 'newest') {
			treinamentosOrdered = treinamentos.toReversed();
			treinamentosOrder = 'newest';
		}
		if (order === 'oldest') {
			treinamentosOrdered = treinamentos;
			treinamentosOrder = 'oldest';
		}
	}

	onMount(() => {
		const layout = localStorage.getItem('exhibition');
		exhibition = layout ? layout : 'grid';
		if (isAdmin && !treinamentos.length) {
			get(child(ref(database), 'treinamentos'))
				.then((snapshot) => {
					if (snapshot.exists()) {
						treinamentos = snapshot.val();
						treinamentosOrdered = treinamentos;
						treinamentosOrder = 'oldest';
					} else {
						console.log('No data available');
					}
				})
				.catch((err) => console.error(err));
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
	$effect(() => {
		untrack(() => {
			console.log(`current user: ${auth.currentUser?.email}`);
			if (!isAdmin.value) {
				console.log('effect in untrack is HIT to isAdmin === false');
				goto('/');
				return;
			} else {
				console.log('effect in untrack is HIT to isAdmin === true');
			}
		});
	});
</script>

<main class="my-4 flex w-full flex-col items-center justify-center gap-4">
	{#if isAdmin.value}
		<div class="glass-bg flex w-full max-w-[80ch] flex-col items-center gap-2 p-4">
			<button
				onclick={() => (showTreinamentos = !showTreinamentos)}
				class="relative cursor-pointer"
			>
				<h2 class="cool-title">Treinamentos</h2>
				<div class="absolute -right-10 bottom-0 h-full cursor-pointer">
					<Chevron class="text-3xl transition-all {showTreinamentos ? 'rotate-180' : ''}" />
				</div>
			</button>
			{#if showTreinamentos}
				<div transition:slide class="flex w-full flex-col gap-2">
					<div class="flex w-full justify-center">
						<button
							onclick={() => {
								addVideo = true;
							}}
							class="button-base"><span>Adicionar Video</span><span><Add /></span></button
						>
					</div>
					<div class="flex w-full justify-between">
						<div class="flex w-full items-center gap-2">
							<span>Exibição:</span>
							<button
								onclick={() => {
									exhibition = 'list';
									localStorage.setItem('exhibition', 'list');
								}}
								class="cursor-pointer transition-opacity {exhibition === 'list'
									? 'opacity-100 drop-shadow-[0_0_3px_white]'
									: 'opacity-50 hover:opacity-100'}"><List /></button
							>
							<button
								onclick={() => {
									exhibition = 'grid';
									localStorage.setItem('exhibition', 'grid');
								}}
								class="cursor-pointer transition-opacity {exhibition === 'grid'
									? 'opacity-100 drop-shadow-[0_0_3px_white]'
									: 'opacity-50 hover:opacity-100'}"><Square /></button
							>
						</div>
						<div class="flex w-fit items-center gap-2">
							<span>Ordem:</span>
							<button
								onclick={() => {
									handleVideoOrder('newest');
								}}
								class="cursor-pointer transition-opacity {treinamentosOrder === 'newest'
									? 'opacity-100 drop-shadow-[0_0_3px_white]'
									: 'opacity-50 hover:opacity-100'}">Novo</button
							>
							<button
								onclick={() => {
									handleVideoOrder('oldest');
								}}
								class="cursor-pointer transition-opacity {treinamentosOrder === 'oldest'
									? 'opacity-100 drop-shadow-[0_0_3px_white]'
									: 'opacity-50 hover:opacity-100'}">Velho</button
							>
						</div>
					</div>
					{#if exhibition === 'list'}
						<table class="w-full table-fixed">
							<thead class="border-b">
								<tr class="text-left">
									<th class="w-[60%]">Título</th>
									<th class="w-[30%]">Autor</th>
									<th class="w-[10%]">Ações</th>
								</tr>
							</thead>
							<tbody>
								{#each treinamentosOrdered as treinamento, i}
									<tr class="border-b border-white/20 text-nowrap">
										<td class="overflow-hidden py-2 pr-2 overflow-ellipsis">
											<a
												target="_blank"
												class="cursor-pointer hover:underline"
												href={`https://youtube.com/watch?v=${treinamento.link}`}
												>{treinamento.titulo}</a
											>
										</td>
										<td class="overflow-hidden pr-2 overflow-ellipsis">{treinamento.autor}</td>
										<td>
											<button class="translate-y-1 cursor-pointer"><Gear /></button>
											<button class="translate-y-1 cursor-pointer hover:text-red-600"
												><Trash /></button
											>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
					{#if exhibition === 'grid'}
						<div class="grid w-full grid-cols-3 gap-4">
							{#each treinamentosOrdered as treinamento, i}
								<div class="group relative flex flex-col gap-1">
									<div class="aspect-video overflow-clip rounded-xl border border-white/20 shadow">
										<img
											src="https://i.ytimg.com/vi/{treinamento.link}/maxresdefault.jpg"
											class="transition-opacity group-hover:opacity-50"
											alt=""
										/>
									</div>
									<a
										target="_blank"
										class="cool-title cursor-pointer font-['Grifter'] tracking-wider hover:underline"
										href={`https://youtube.com/watch?v=${treinamento.link}`}>{treinamento.titulo}</a
									>
									<span class="text-sm opacity-70">{treinamento.autor}</span>
									<div class="absolute hidden w-full justify-end p-3 group-hover:flex">
										<button
											class="cursor-pointer transition-transform hover:scale-125 hover:rotate-30"
											><Gear /></button
										>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<div class="glass-bg flex w-full max-w-[80ch] flex-col items-center gap-2 p-4">
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
									class="group/button relative w-full cursor-pointer rounded-xl bg-slate-700 py-4 shadow transition-all hover:shadow-lg"
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
												<button class="rounded bg-slate-700 px-1 hover:text-red-500"
													><Trash /></button
												>
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

		<div class="glass-bg flex w-full max-w-[80ch] flex-col items-center gap-2 p-4">
			<button onclick={() => (showUsers = !showUsers)} class="relative cursor-pointer">
				<h2 class="cool-title">Usuários</h2>
				<div class="absolute -right-10 bottom-0 h-full cursor-pointer">
					<Chevron class="text-3xl transition-all {showUsers ? 'rotate-180' : ''}" />
				</div>
			</button>
			{#if showUsers}
				<div transition:slide>
					<p>Lista de todos os usuários</p>
				</div>
			{/if}
		</div>
		<div class="glass-bg flex w-full max-w-[80ch] flex-col items-center gap-2 p-4">
			<button onclick={() => (showCumbuca = !showCumbuca)} class="relative cursor-pointer">
				<h2 class="cool-title">Cumbuca</h2>
				<div class="absolute -right-10 bottom-0 h-full cursor-pointer">
					<Chevron class="text-3xl transition-all {showCumbuca ? 'rotate-180' : ''}" />
				</div>
			</button>
			{#if showCumbuca}
				<div transition:slide>
					<p>Menu para administrar cumbuca</p>
				</div>
			{/if}
		</div>
		<button onclick={() => goto(`/${currentUsername.value}`)} class="button-base"
			>Ir para o seu perfil</button
		>
	{:else}
		<div>Você não tem autorização para ver esta página</div>
		<button onclick={() => goto('/')} class="button-base">Voltar</button>
	{/if}
</main>

{#if addVideo}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-2 bg-black/50"
		onclick={() => (addVideo = false)}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="flex flex-col gap-6 rounded-xl bg-white/10 p-5 backdrop-blur"
		>
			<div class="flex flex-col gap-2">
				<div>
					<input
						type="text"
						name="link"
						id="link"
						class="rounded-lg bg-white/10 placeholder:text-white/50"
						placeholder="Link do Vídeo"
						bind:value={addVideoLink}
					/>
				</div>
				<div>
					<input
						type="text"
						name="titulo"
						id="titulo"
						class="rounded-lg bg-white/10 placeholder:text-white/50"
						placeholder="Título do Vídeo"
						bind:value={addVideoTitle}
					/>
				</div>
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
						const newVideo = {
							link: addVideoLink,
							titulo: addVideoTitle,
							autor: addVideoAuthor
						};
						treinamentos = [...treinamentos, newVideo];
						addVideo = false;
					}}
					class="button-base disabled:pointer-events-none disabled:opacity-50">Salvar</button
				>
				<button
					onclick={() => {
						addVideoAuthor = '';
						addVideoLink = '';
						addVideoTitle = '';
						addVideo = false;
					}}
					class="button-base border border-white bg-transparent text-white hover:bg-white hover:text-black"
					>Cancelar</button
				>
			</div>
		</div>
	</div>
{/if}

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
