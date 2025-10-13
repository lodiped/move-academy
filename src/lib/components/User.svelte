<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { namesConvert, isAdmin, isUser, isLogged, sector } from '$lib/state.svelte';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	// @ts-ignore
	import Signout from 'virtual:icons/mdi/sign-out';
	async function handleGoogleSignOut() {
		try {
			await signOut(auth);
			isLogged.value = false;
			isUser.value = false;
			goto('/');
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="glass-bg flex flex-col items-center justify-start gap-6 p-6">
	<div class="flex w-full items-start justify-start gap-4">
		<div
			class="high-button aspect-square w-20 rounded-full bg-cover bg-center"
			style="background-image: url('/perfil/{page.params.username}.png')"
		></div>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center justify-between gap-3">
				<h3 class="cool-title -mb-2">{namesConvert[page.params.username]}</h3>
				<button
					onclick={handleGoogleSignOut}
					class="flex cursor-pointer items-center justify-center gap-1 text-sm opacity-50 transition-opacity hover:opacity-100"
				>
					<span class="font-['Grifter'] tracking-wider">Sair</span>
					<Signout />
				</button>
			</div>
			<div class="flex items-center gap-1">
				<span class="text-xs opacity-60">Setor:</span>
				{#each sector.value as setor}
					<div
						class="text-accent-700/70 high-button w-fit rounded-full bg-yellow-400 p-0.5 px-1.5 text-xs font-bold"
					>
						{setor}
					</div>
				{/each}
			</div>
			<div class="group relative flex min-h-7 w-full items-center justify-start gap-2 rounded-full">
				<div class="flex w-full items-center justify-start gap-2">
					<div
						class="group inset-button relative flex h-fit min-h-7 w-full items-center justify-start gap-2 rounded-full px-2.5"
					>
						<div class="progress-bar relative overflow-hidden" style="width: 65%">
							<div
								class="bg-linear absolute top-0 -left-[70px] h-full w-[60px] bg-linear-90 from-transparent via-white to-transparent transition-all duration-1000 group-hover:left-[100%]"
							></div>
						</div>
					</div>
					<span class="min-w-[4ch] text-start font-['Grifter'] text-sm">65%</span>
				</div>
				<p
					class="pointer-events-none absolute top-7 left-0 w-full text-end font-['Grifter'] text-sm tracking-wider text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
				>
					progresso das obrigatórias
				</p>
			</div>
		</div>
	</div>
	{#if isAdmin.value}
		<button class="button-base w-full" onclick={() => goto('/admin')}>Ir para o Painel Admin</button
		>
	{/if}
</div>
