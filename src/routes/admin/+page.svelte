<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAdmin, currentUsername } from '$lib/state.svelte';
	import { auth } from '$lib/firebase';

	import AdminTreinamentos from '$lib/components/AdminTreinamentos.svelte';
	import AdminTrilhas from '$lib/components/AdminTrilhas.svelte';
	import AdminUsers from '$lib/components/AdminUsers.svelte';
	import AdminCumbuca from '$lib/components/AdminCumbuca.svelte';

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
		<AdminUsers />
		<AdminCumbuca />
		<button onclick={() => goto(`/${currentUsername.value}`)} class="button-base"
			>Ir para o seu perfil</button
		>
	{:else}
		<div>Você não tem autorização para ver esta página</div>
		<button onclick={() => goto('/')} class="button-base">Voltar</button>
	{/if}
</main>
