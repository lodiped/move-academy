<script lang="ts">
	import { page } from '$app/state';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { currentUsername, namesConvert, isLogged, isUser, isAdmin } from '$lib/state.svelte';
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';

	import Cumbucas from '$lib/components/Cumbucas.svelte';

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
	// @ts-ignore
	import Dots from 'virtual:icons/mdi/dots-horizontal';
	// @ts-ignore
	import Chevron from 'virtual:icons/mdi/chevron-down';
	// @ts-ignore
	import Check from 'virtual:icons/mdi/check-circle-outline';
	// @ts-ignore
	import Play from 'virtual:icons/mdi/play';
	// @ts-ignore
	import Lock from 'virtual:icons/mdi/lock';
	// @ts-ignore
	import Signout from 'virtual:icons/mdi/sign-out';

	let trilhaTest = $state(false);

	$effect(() => {
		untrack(() => {
			console.log(`current user: ${auth.currentUser?.email}`);
		});
	});
</script>

{#if !isAdmin.value}
	<h1 class="cool-title my-5">Move Academy</h1>
	{#if currentUsername.value === page.params.username}
		<div class="mb-10 flex w-full flex-col justify-center gap-4 px-3 lg:flex-row">
			<div class="flex w-full max-w-[50ch] flex-col gap-4">
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
				<Cumbucas />
			</div>
			<div class="flex w-full max-w-[80ch] flex-col gap-4">
				<div class="glass-bg flex w-full flex-col gap-2 p-3">
					<div class="px-3">
						<h2 class="cool-title">Continue Assitindo</h2>
					</div>
					<div class="flex gap-3 px-3 pb-3">
						<div
							class=" aspect-video min-w-40 rounded-2xl bg-stone-300 transition-all hover:scale-105 hover:rounded-none active:scale-100"
						></div>
						<div class="flex w-full flex-col">
							<p class="font-['Grifter'] text-2xl font-bold tracking-wide text-white/85">
								Título do vídeo
							</p>
							<div class="flex items-center gap-3">
								<div class="h-3 min-h-3 w-full rounded-full bg-stone-800/50 shadow">
									<div
										class=" from-accent-500 min-h-3 w-2/3 rounded-full bg-linear-to-t to-[#66ccff] shadow"
									></div>
								</div>
								<span class="text-xl">65%</span>
							</div>
							<p class="font-['Grifter'] text-white/85">Trilha: BPO Financeiro - Modulo X</p>
						</div>
					</div>
				</div>
				<div class="glass-bg flex w-full flex-col gap-5 p-3 pb-6">
					<h2 class="cool-title -mb-3 px-3">Cursos matriculados</h2>

					<div class="flex w-full flex-col px-3 transition-all">
						<button
							onclick={() => (trilhaTest = !trilhaTest)}
							class="group flex w-full cursor-pointer gap-4 rounded-lg bg-stone-800 p-4"
						>
							<div class="flex w-2/3 justify-between gap-2">
								<span class="text-xl font-bold">Trilha: BPO Financeiro</span>
								<span class="opacity-50">Módulo X</span>
							</div>
							<div class="flex w-1/3 items-center justify-center">
								<div class="h-3 min-h-3 w-full rounded-full bg-stone-300">
									<div class="bg-accent-500 min-h-3 w-2/3 rounded-full"></div>
								</div>
							</div>
							<div class="flex items-center justify-center text-2xl">
								<Chevron class="transition-all {trilhaTest ? 'rotate-180' : ''}" />
							</div>
						</button>
						{#if trilhaTest}
							<div
								transition:slide={{ duration: 200 }}
								class="mx-3 flex w-auto flex-col gap-3 rounded-b-lg bg-stone-900 p-3 px-5"
							>
								<div class="flex items-center justify-between gap-2 opacity-50">
									<div class="flex w-full items-center gap-2">
										<Check class="text-green-500" />
										<span>Título do video 1</span>
									</div>
									<span>45:00</span>
									<div class="h-3 min-h-3 w-full max-w-1/3 rounded-full bg-stone-300">
										<div class="bg-accent-500 min-h-3 w-full rounded-full"></div>
									</div>
								</div>
								<div class="flex items-center justify-between gap-2 opacity-50">
									<div class="flex w-full items-center gap-2">
										<Check class="text-green-500" />
										<span>Título do video 2</span>
									</div>
									<span>33:33</span>
									<div class="h-3 min-h-3 w-full max-w-1/3 rounded-full bg-stone-300">
										<div class="bg-accent-500 min-h-3 w-full rounded-full"></div>
									</div>
								</div>
								<div class="flex items-center justify-between gap-2">
									<div class="flex w-full items-center gap-2">
										<Play />
										<span>Título do video 3</span>
									</div>
									<span>1:05:04</span>
									<div class="h-3 min-h-3 w-full max-w-1/3 rounded-full bg-stone-300">
										<div class="bg-accent-500 min-h-3 w-2/3 rounded-full"></div>
									</div>
								</div>
								<div class="text-accent-700 flex items-center justify-between gap-2">
									<div class="flex w-full items-center gap-2">
										<Lock />
										<span>Título do video 4</span>
									</div>
									<span>1:05:04</span>
									<div class="h-3 min-h-3 w-full max-w-1/3 rounded-full bg-stone-300">
										<div class="bg-accent-500 min-h-3 w-0 rounded-full"></div>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<button class="group mx-3 flex cursor-pointer gap-4 rounded-lg bg-stone-800 p-4">
						<div class="flex w-2/3 justify-between gap-2">
							<span class="text-xl font-bold">Trilha: Contábil</span>
							<span class="opacity-50">Completo</span>
						</div>
						<div class="flex w-1/3 items-center justify-center">
							<div class="h-3 min-h-3 w-full rounded-full bg-stone-300">
								<div class="bg-accent-500 min-h-3 w-full rounded-full"></div>
							</div>
						</div>
						<div class="flex items-center justify-center text-2xl">
							<Chevron />
						</div>
					</button>
					<button class="group mx-3 flex cursor-pointer gap-4 rounded-lg bg-stone-800 p-4">
						<div class="flex w-2/3 justify-between gap-2">
							<span class="text-xl font-bold">Trilha: Onboarding</span>
							<span class="opacity-50">Completo</span>
						</div>
						<div class="flex w-1/3 items-center justify-center">
							<div class="h-3 min-h-3 w-full rounded-full bg-stone-300">
								<div class="bg-accent-500 min-h-3 w-full rounded-full"></div>
							</div>
						</div>
						<div class="flex items-center justify-center text-2xl">
							<Chevron />
						</div>
					</button>
				</div>
				<div class="glass-bg flex w-full flex-col gap-5 p-3">
					<h2 class="cool-title -mb-3 px-3">Cursos Disponíveis</h2>
					<button
						class="group mx-3 flex cursor-pointer justify-between gap-4 rounded-lg bg-stone-800 p-4"
					>
						<div class="flex w-full justify-between gap-2">
							<span class="text-xl font-bold">Curso Contábil Tal</span>
							<div class="flex gap-5 opacity-50">
								<span>10 Vídeos</span>
								&bull;
								<span>4 horas</span>
							</div>
						</div>
						<div class="flex items-center justify-center text-2xl">
							<Chevron />
						</div>
					</button>
					<button
						class="group mx-3 flex cursor-pointer justify-between gap-4 rounded-lg bg-stone-800 p-4"
					>
						<div class="flex w-full justify-between gap-2">
							<span class="text-xl font-bold">Curso Contábil Tal</span>
							<div class="flex gap-5 opacity-50">
								<span>10 Vídeos</span>
								&bull;
								<span>4 horas</span>
							</div>
						</div>
						<div class="flex items-center justify-center text-2xl">
							<Chevron />
						</div>
					</button>
					<button
						class="group mx-3 flex cursor-pointer justify-between gap-4 rounded-lg bg-stone-800 p-4"
					>
						<div class="flex w-full justify-between gap-2">
							<span class="text-xl font-bold">Curso Contábil Tal</span>
							<div class="flex gap-5 opacity-50">
								<span>10 Vídeos</span>
								&bull;
								<span>4 horas</span>
							</div>
						</div>
						<div class="flex items-center justify-center text-2xl">
							<Chevron />
						</div>
					</button>
					<button
						class="group mx-3 flex cursor-pointer justify-between gap-4 rounded-lg bg-stone-800 p-4"
					>
						<div class="flex w-full justify-between gap-2">
							<span class="text-xl font-bold">Curso Contábil Tal</span>
							<div class="flex gap-5 opacity-50">
								<span>10 Vídeos</span>
								&bull;
								<span>4 horas</span>
							</div>
						</div>
						<div class="flex items-center justify-center text-2xl">
							<Chevron />
						</div>
					</button>
					<button
						class="group mx-3 flex cursor-pointer justify-between gap-4 rounded-lg bg-stone-800 p-4"
					>
						<div class="hidden items-center justify-center group-hover:flex">
							<Play />
						</div>
						<div class="flex w-full justify-between gap-2">
							<span class="text-xl font-bold">Curso Contábil Tal</span>
							<div class="flex gap-5 opacity-50">
								<span>4 horas</span>
							</div>
						</div>
						<div class="flex items-center justify-center text-2xl">
							<Chevron />
						</div>
					</button>
					<div class="flex w-full justify-center py-2 text-2xl">
						<Dots class="cursor-pointer" />
					</div>
				</div>
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
{/if}
