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
	let exhibition: string = $state('list');

	let showTreinamentos = $state(false);

	onMount(() => {
		const layout = localStorage.getItem('exhibition');
		exhibition = layout ? layout : 'list';
		if (isAdmin && !treinamentos.length) {
			get(child(ref(database), 'treinamentos'))
				.then((snapshot) => {
					if (snapshot.exists()) {
						console.log(snapshot.val());
						treinamentos = snapshot.val();
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
				<button class="button-base"><span>Adicionar Video</span><span><Add /></span></button>
				<div class="flex w-full items-center gap-2">
					<span>Exibição:</span>
					<button
						onclick={() => {
							exhibition = 'list';
							localStorage.setItem('exhibition', 'list');
						}}
						class="trasition-opacity cursor-pointer {exhibition === 'list'
							? 'drop-shadow-[0_0_3px_white]'
							: 'opacity-50 hover:opacity-100'}"><List /></button
					>
					<button
						onclick={() => {
							exhibition = 'grid';
							localStorage.setItem('exhibition', 'grid');
						}}
						class="cursor-pointer transition-opacity {exhibition === 'grid'
							? 'drop-shadow-[0_0_3px_white]'
							: 'opacity-50 hover:opacity-100'}"><Square /></button
					>
				</div>
				<div transition:slide>
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
								{#each treinamentos as treinamento, i}
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
							{#each treinamentos as treinamento, i}
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
		<div class="glass-bg flex w-full max-w-[70ch] flex-col items-center gap-2 p-4">
			<h2 class="cool-title">Trilhas</h2>
			<button class="button-base"><span>Adicionar Trilha</span><span><Add /></span></button>
			<div class="flex w-full items-center gap-2">
				<span>Exibição:</span>
				<button onclick={() => (exhibition = 'list')} class="cursor-pointer"><List /></button>
				<button onclick={() => (exhibition = 'grid')} class="cursor-pointer"><Square /></button>
			</div>
		</div>

		<div class="glass-bg flex w-full max-w-[70ch] flex-col items-center gap-2 p-4">
			<h2 class="cool-title">Todos os usuários</h2>
			<div>
				<p>Lista de todos os usuários</p>
			</div>
		</div>
		<div class="glass-bg flex w-full max-w-[70ch] flex-col items-center gap-2 p-4">
			<h2 class="cool-title">Cumbuca</h2>
			<div>
				<p>Menu para administrar cumbuca</p>
			</div>
		</div>
		<button onclick={() => goto(`/${currentUsername.value}`)} class="button-base"
			>Ir para o seu perfil</button
		>
	{:else}
		<div>Você não tem autorização para ver esta página</div>
		<button onclick={() => goto('/')} class="button-base">Voltar</button>
	{/if}
</main>
