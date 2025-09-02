<script lang="ts">
	import { page } from '$app/state';
	import { auth } from '$lib/firebase';
	import { currentUsername, isLogged, isUser, isAdmin } from '$lib/state.svelte';
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';

	import Cumbucas from '$lib/components/Cumbucas.svelte';
	import User from '$lib/components/User.svelte';
	import CtaHeader from '$lib/components/CtaHeader.svelte';
	import Matriculados from '$lib/components/Matriculados.svelte';
	import Disponiveis from '$lib/components/Disponiveis.svelte';

	$effect(() => {
		untrack(() => {
			if (!isLogged.value || (!isUser.value && !isAdmin.value)) {
				console.log('not logged in @movenegocios.com.br account');
				goto('/');
				return;
			}
			console.log(`current user: ${auth.currentUser?.email}`);
		});
	});
</script>

<h1 class="cool-title my-5">Move Academy</h1>
{#if currentUsername.value === page.params.username}
	<div class="mb-10 flex w-full flex-col justify-center gap-4 px-3 lg:flex-row">
		<div class="flex w-full max-w-[50ch] flex-col gap-4">
			<User />
			<Cumbucas />
		</div>
		<div class="flex w-full max-w-[80ch] flex-col gap-4">
			<CtaHeader />
			<Matriculados />
			<Disponiveis />
			<div class="glass-bg flex flex-col items-center gap-2 bg-[#d6b600] p-5">
				<p class="w-full text-center font-['Grifter'] font-bold text-black/70">
					Aproveite os cursos da Conquer
				</p>
				<a
					href="https://escolaconquer.com.br"
					target="_blank"
					class="w-fit rounded-lg bg-orange-600 px-4 py-3 font-['Grifter'] text-white/85 shadow-lg"
					>Clique Aqui</a
				>
			</div>
		</div>
	</div>
{/if}
