<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAdmin, currentUsername } from '$lib/state.svelte';
	import { auth } from '$lib/firebase';

	import Wrench from 'virtual:icons/mdi/wrench';
	import Chevron from 'virtual:icons/mdi/chevron-down';
	import Switch from 'virtual:icons/mdi/autorenew';
	import Trash from 'virtual:icons/mdi/trash-can-outline';
	import Gear from 'virtual:icons/mdi/gear';
	import Add from 'virtual:icons/mdi/plus-thick';
	import Square from 'virtual:icons/mdi/crop-square';
	import List from 'virtual:icons/mdi/format-list-bulleted';

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
		<div class="glass-bg flex w-full max-w-[70ch] flex-col items-center gap-2 p-4">
			<h2 class="cool-title">Todos os videos</h2>
			<button class="button-base"><span>Adicionar Video</span><span><Add /></span></button>
			<div class="flex w-full items-center gap-2">
				<span>Exibição:</span>
				<button class="cursor-pointer"><List /></button>
				<button class="cursor-pointer"><Square /></button>
			</div>
			<div class="flex w-full flex-col text-nowrap">
				<div class="flex w-full gap-4">
					<div class="flex w-fit flex-col gap-1">
						<span>Nº</span>
						<div class="w-full">
							<span>1.</span>
						</div>
						<div class="w-full">
							<span>2.</span>
						</div>
						<div class="w-full">
							<span>3.</span>
						</div>
					</div>
					<div class="flex w-full flex-col gap-1">
						<span>Título</span>
						<div class="w-full">
							<span>Curso tal e tal</span>
						</div>
						<div class="w-full">
							<span>Titulo do video</span>
						</div>
						<div class="w-full">
							<span>Nome</span>
						</div>
					</div>
					<div class="flex w-full max-w-[8ch] flex-col gap-1">
						<span>Duração</span>
						<div class="flex w-full items-center">
							<span>45:00</span>
						</div>
						<div class="flex w-full items-center">
							<span>10:45:00</span>
						</div>
						<div class="flex w-full items-center">
							<span>45:00</span>
						</div>
					</div>
					<div class="flex w-full max-w-[12ch] flex-col gap-1">
						<span>Trilha</span>
						<div class="group flex w-full cursor-pointer items-center gap-1">
							<div class="w-full overflow-hidden overflow-ellipsis">
								<span>BPO Financeiro</span>
							</div>
							<button class="hidden text-sm group-hover:block"><Switch /></button>
						</div>
						<div class="group flex w-full cursor-pointer items-center gap-1">
							<div class="w-full overflow-hidden overflow-ellipsis">
								<span>--</span>
							</div>
							<button class="hidden text-sm group-hover:block"><Switch /></button>
						</div>
						<div class="group flex w-full cursor-pointer items-center gap-1">
							<div class="w-full overflow-hidden overflow-ellipsis">
								<span>Contábil</span>
							</div>
							<button class="hidden text-sm group-hover:block"><Switch /></button>
						</div>
					</div>
					<div class="flex w-fit flex-col gap-1">
						<span>Ordem</span>
						<div class="flex items-center">
							<span>2</span>
						</div>
						<div class="flex items-center">
							<span>--</span>
						</div>
						<div class="flex items-center">
							<span>3</span>
						</div>
					</div>
					<div class="flex w-fit flex-col gap-1">
						<span>Ações</span>
						<div class="flex min-h-[1.7rem] items-center justify-center gap-1">
							<button class="cursor-pointer"><Gear /></button>
							<button class="cursor-pointer hover:text-red-600"><Trash /></button>
						</div>
						<div class="flex min-h-[1.7rem] items-center justify-center gap-1">
							<button class="cursor-pointer"><Gear /></button>
							<button class="cursor-pointer hover:text-red-600"><Trash /></button>
						</div>
						<div class="flex min-h-[1.7rem] items-center justify-center gap-1">
							<button class="cursor-pointer"><Gear /></button>
							<button class="cursor-pointer hover:text-red-600"><Trash /></button>
						</div>
					</div>
				</div>
				<div class="flex w-full"></div>
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
