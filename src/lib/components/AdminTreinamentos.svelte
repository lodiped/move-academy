<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { database } from '$lib/firebase';
	import { get, child, ref, set, getDatabase, update, runTransaction } from 'firebase/database';
	import { isAdmin, version } from '$lib/state.svelte';
	let showTreinamentos = $state(false);
	let exhibition = $state('list');

	// page interactivity v

	let confirmDelete = $state(false);
	let deleteLink = $state('');

	let editModal = $state(false);
	let editTitle = $state('');
	let editAuthor = $state('');

	// page interactivity end ^
	let treinamentos: any = $state([]);
	let treinamentosOrdered: any = $state('');
	let treinamentosOrder = $state('');

	import Chevron from 'virtual:icons/mdi/chevron-down';
	import Trash from 'virtual:icons/mdi/trash-can-outline';
	import Gear from 'virtual:icons/mdi/gear';
	import Add from 'virtual:icons/mdi/plus-thick';
	import Square from 'virtual:icons/mdi/grid-large';
	import List from 'virtual:icons/mdi/format-list-bulleted';

	let addVideo = $state(false);
	let addVideoLink = $state('');
	let addVideoTitle = $state('');
	let addVideoAuthor = $state('');

	async function writeNewVideo(newVideo: any) {
		const db = getDatabase();

		const videoId = newVideo.link;

		const postData = {
			titulo: newVideo.titulo,
			autor: newVideo.autor,
			data: newVideo.data
		};

		const updates: any = {};
		updates[`/treinamentosproper/${videoId}`] = postData;

		return update(ref(db), updates)
			.then(() => {
				console.log('Video adicionado com sucesso!');
				runTransaction(ref(database, 'version'), (version) => {
					return version + 1;
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function removeVideo(link: string) {
		const db = getDatabase();
		return await set(ref(db, `treinamentosproper/${link}`), null)
			.then(() => {
				console.log('Video removido com sucesso!');
				runTransaction(ref(database, 'version'), (version) => {
					return version + 1;
				});
				getTreinamentos();
				order();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	let videosCache: any = null;

	function checkLocalStorage() {
		if (localStorage.treinamentos) {
			videosCache = JSON.parse(localStorage.treinamentos);
			return true;
		} else {
			return false;
		}
	}

	async function checkVersion() {
		return new Promise<boolean>(async (resolve, reject) => {
			try {
				const snapshot = await get(child(ref(database), 'version'));
				const dbVersion = snapshot.val() ? snapshot.val() : null;
				if (localStorage.version == dbVersion) {
					resolve(true);
				} else {
					localStorage.version = dbVersion;
					version.value = dbVersion;
					resolve(false);
				}
			} catch (err) {
				console.log(err);
			}
		});
	}

	function parseObject(obj: any) {
		return Object.entries(obj).map(([link, data]) => ({
			link,
			...videosCache[link]
		}));
	}

	function order() {
		let videos = parseObject(videosCache);
		videos.sort((a: any, b: any) => a.data - b.data);
		treinamentos = videos;
		treinamentosOrdered = treinamentos;
		treinamentosOrder = 'oldest';
	}

	async function fetchAndStore() {
		return new Promise(async (resolve, reject) => {
			const treinamentosSnap = await get(child(ref(database), 'treinamentosproper'));

			videosCache = treinamentosSnap.val();
			const treinamentosTest = treinamentosSnap.val();

			localStorage.treinamentos = JSON.stringify(videosCache);
			resolve(treinamentosTest);
		});
	}

	async function getTreinamentos() {
		await checkVersion().then(async (check) => {
			if (!check) {
				await fetchAndStore().then((treinamentosTest) => {
					console.log('check failed: ', parseObject(treinamentosTest));
					treinamentos = parseObject(treinamentosTest);
					return parseObject(treinamentosTest);
				});
			} else {
				if (!checkLocalStorage()) {
					await fetchAndStore().then((treinamentosTest) => {
						console.log('check ok but no localStorage: ', parseObject(treinamentosTest));
						treinamentos = parseObject(treinamentosTest);
						return parseObject(treinamentosTest);
					});
				} else {
					videosCache = JSON.parse(localStorage.treinamentos);
					console.log('check ok and localStorage: ', parseObject(videosCache));
					treinamentos = parseObject(videosCache);
					return parseObject(videosCache);
				}
			}
		});
	}

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

	onMount(async () => {
		const layout = localStorage.getItem('exhibition');
		exhibition = layout ? layout : 'grid';
		if (isAdmin && !treinamentos.length) {
			await getTreinamentos()
				.catch((err) => console.error(err))
				.then(() => {
					order();
				});
		} else {
			goto('/');
			return;
		}
	});
</script>

<div class="glass-bg flex w-full max-w-[80ch] flex-col items-center gap-2 p-4">
	<button onclick={() => (showTreinamentos = !showTreinamentos)} class="relative cursor-pointer">
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
										href={`https://youtube.com/watch?v=${treinamento.link}`}>{treinamento.titulo}</a
									>
								</td>
								<td class="overflow-hidden pr-2 overflow-ellipsis">{treinamento.autor}</td>
								<td>
									<button class="translate-y-1 cursor-pointer"><Gear /></button>
									<button
										class="translate-y-1 cursor-pointer hover:text-red-600"
										onclick={() => {
											deleteLink = treinamento.link;
											confirmDelete = true;
										}}><Trash /></button
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
							<div
								class="absolute hidden w-full items-center justify-end gap-2 p-3 group-hover:flex"
							>
								<button
									class="cursor-pointer transition-transform hover:scale-125 hover:rotate-30"
									onclick={() => removeVideo(treinamento.link)}><Gear /></button
								>
								<button
									class="cursor-pointer hover:text-red-600"
									onclick={() => {
										deleteLink = treinamento.link;
										confirmDelete = true;
									}}><Trash /></button
								>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

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
			<h2>Adicionar Video</h2>
			<div class="flex w-full flex-col gap-2">
				<div>
					<input
						type="text"
						name="link"
						id="link"
						class="w-full rounded-lg bg-white/10 placeholder:text-white/50"
						placeholder="Link do Vídeo"
						bind:value={addVideoLink}
					/>
				</div>
				<div>
					<input
						type="text"
						name="titulo"
						id="titulo"
						class="w-full rounded-lg bg-white/10 placeholder:text-white/50"
						placeholder="Título do Vídeo"
						bind:value={addVideoTitle}
					/>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg bg-white/10 placeholder:text-white/50"
						name="autor"
						id="autor"
						placeholder="Autor(es) do Vídeo"
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
							autor: addVideoAuthor,
							data: Date.now() / 1000
						};
						// treinamentos = [...treinamentos, newVideo];
						writeNewVideo(newVideo);
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

{#if confirmDelete}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-2 bg-black/50"
		onclick={() => (confirmDelete = false)}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="flex flex-col gap-6 rounded-xl bg-white/10 p-5 backdrop-blur"
		>
			<h2>Tem certeza?</h2>
			<div class="flex w-full flex-col items-center justify-center gap-4">
				<div>
					<button
						class="button-base"
						onclick={() => {
							removeVideo(deleteLink);
							confirmDelete = false;
						}}>Deletar</button
					>
				</div>
				<div>
					<button
						class="cursor-pointer"
						onclick={() => {
							confirmDelete = false;
						}}>Cancelar</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if editModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-2 bg-black/50"
		onclick={() => (editModal = false)}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="flex flex-col gap-6 rounded-xl bg-white/10 p-5 backdrop-blur"
		>
			<h2>Editar Video</h2>
			<div class="flex w-full flex-col gap-2">
				<div>
					<input
						type="text"
						name="titulo"
						id="titulo"
						class="w-full rounded-lg bg-white/10 placeholder:text-white/50"
						placeholder="Título do Vídeo"
						bind:value={editTitle}
					/>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg bg-white/10 placeholder:text-white/50"
						name="autor"
						id="autor"
						placeholder="Autor(es) do Vídeo"
						bind:value={editAuthor}
					/>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<button
					onclick={() => {
						console.log('edit requested');
						editModal = false;
					}}
					class="button-base">Salvar</button
				>
				<button
					onclick={() => {
						editModal = false;
					}}
					class="button-base border border-white bg-transparent text-white hover:bg-white hover:text-black"
					>Cancelar</button
				>
			</div>
		</div>
	</div>
{/if}
