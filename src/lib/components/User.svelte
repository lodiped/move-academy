<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { namesConvert, isAdmin, isUser, isLogged } from '$lib/state.svelte';
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

<div
	class="flex items-center justify-start gap-4 rounded-3xl border-t border-r border-b border-t-white/50 border-r-white/30 border-b-white/10 bg-linear-30 from-white/5 to-white/30 p-6 shadow shadow-black/20"
>
	<div
		class="aspect-square w-20 rounded-full bg-cover bg-center shadow shadow-black/40"
		style="background-image: url('/perfil/{page.params.username}.png')"
	></div>
	<div class="flex w-full flex-col gap-2">
		<div class="flex items-center justify-between gap-3">
			<h3 class="cool-title">{namesConvert[page.params.username]}</h3>
			<button
				onclick={handleGoogleSignOut}
				class="flex cursor-pointer items-center justify-center gap-1 text-sm opacity-50 transition-opacity hover:opacity-100"
			>
				<span class="font-['Grifter'] tracking-wider">Sair</span>
				<Signout />
			</button>
		</div>
		<div class="group relative h-3 min-h-3 w-full rounded-full bg-stone-800/50 shadow">
			<div
				class="from-accent-500 min-h-3 w-2/3 rounded-full bg-linear-to-t to-[#66ccff] shadow"
			></div>
			<p
				class="pointer-events-none absolute top-3 left-0 w-full text-end font-['Grifter'] text-sm tracking-wider text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
			>
				progresso das obrigatórias
			</p>
		</div>
	</div>
</div>
{#if isAdmin.value}
	<button class="button-base" onclick={() => goto('/admin')}>Go to Admin Panel</button>
{/if}
