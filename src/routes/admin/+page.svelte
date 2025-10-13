<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAdmin, currentUsername } from '$lib/state.svelte';
	import { auth } from '$lib/firebase';

	import Chevron from 'virtual:icons/mdi/chevron-down';
	import { slide } from 'svelte/transition';
	import AdminTreinamentos from '$lib/components/AdminTreinamentos.svelte';
	import AdminTrilhas from '$lib/components/AdminTrilhas.svelte';
	let showUsers = $state(false);
	let showCumbuca = $state(false);

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
		<AdminTreinamentos />
		<AdminTrilhas />

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
