<script lang="ts">
	import { page } from '$app/state';
	import { auth } from '$lib/firebase';
	import { currentUsername, namesConvert } from '$lib/state.svelte';
	import { untrack } from 'svelte';

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
	import { slide } from 'svelte/transition';
	import Cumbucas from '$lib/components/Cumbucas.svelte';

	let trilhaTest = $state(false);

	// log firebase auth email on console
	// auth.onAuthStateChanged((user) => {
	// 	if (user) {
	// 		console.log(user.email);
	// 	}
	// });

	$effect(() => {
		untrack(() => {
			console.log(`current user: ${auth.currentUser?.email}`);
		});
	});
</script>

<h1 class="my-5">Move Academy</h1>
<div class="my-2 flex w-full justify-center uppercase">
	<div class="flex w-full max-w-[130ch] justify-start gap-1 px-2 *:text-sm">
		<a href="/" class="opacity-50 hover:opacity-100">home</a>
		<span class="opacity-50">&gt;</span>
		<span>{namesConvert[page.params.username]}</span>
	</div>
</div>
{#if currentUsername.value === page.params.username}
	<div class="mb-10 flex w-full flex-col justify-center gap-5 lg:flex-row">
		<div class="flex w-full max-w-[50ch] flex-col gap-2 lg:pl-2">
			<div class="flex items-center justify-start gap-4 rounded-lg border p-5">
				<div class="aspect-square w-20 rounded-full bg-stone-700"></div>
				<div class="flex w-full flex-col gap-2">
					<h3>{namesConvert[page.params.username]}</h3>
					<div class="min-h-3 w-full rounded-full bg-stone-700">
						<div class="bg-accent-500 min-h-3 w-2/3 rounded-full"></div>
					</div>
				</div>
			</div>
			<Cumbucas />
			<div class="flex flex-col gap-2 rounded-lg border p-5">
				<h2 class="pb-3">Cumbucas Passadas</h2>
				<div class="grid w-full grid-cols-2 gap-2">
					<!-- for loop -->
					<div class="flex flex-col items-center">
						<div
							class="flex min-h-[200px] w-[130px] items-center justify-center rounded bg-green-400"
						>
							Capa
						</div>
						<p class="text-xl font-bold">Um Título do Livro</p>
						<p class="text-sm opacity-50">Autor Sobrenome, 2000</p>
					</div>
					<div class="flex flex-col items-center">
						<div
							class="flex min-h-[200px] w-[130px] items-center justify-center rounded bg-rose-600"
						>
							Capa
						</div>
						<p class="text-xl font-bold">Título</p>
						<p class="text-sm opacity-50">Autor Sobrenome, 2000</p>
					</div>
					<div class="flex flex-col items-center">
						<div
							class="flex min-h-[200px] w-[130px] items-center justify-center rounded bg-blue-400"
						>
							Capa
						</div>
						<p class="text-xl font-bold">Nome do Livro</p>
						<p class="text-sm opacity-50">Autor Sobrenome, 2000</p>
					</div>
					<div class="flex flex-col items-center">
						<div
							class="flex min-h-[200px] w-[130px] items-center justify-center rounded bg-amber-400"
						>
							Capa
						</div>
						<p class="text-xl font-bold">Livro Tal</p>
						<p class="text-sm opacity-50">Autor Sobrenome, 2000</p>
					</div>
				</div>
				<div class="flex w-full justify-center pt-5 pb-2 text-2xl">
					<Dots class="cursor-pointer" />
				</div>
			</div>
		</div>
		<div class="flex w-full max-w-[80ch] flex-col gap-2 lg:pr-2">
			<div class="flex w-full flex-col gap-5 rounded-xl border p-3 pb-6">
				<h2 class="-mb-3 px-3">Cursos matriculados</h2>
				<div class="flex w-full flex-col gap-2 rounded-lg bg-white p-4 text-black">
					<div>
						<h3 class="-mt-2">Continue Assitindo</h3>
					</div>
					<div class="flex gap-3">
						<div
							class=" aspect-video min-w-40 rounded-2xl bg-stone-300 transition-all hover:scale-105 hover:rounded-none active:scale-100"
						></div>
						<div class="flex w-full flex-col">
							<p class="text-accent-500 text-3xl font-bold tracking-wide">Título do vídeo</p>
							<div class="flex items-center gap-3">
								<div class="h-3 min-h-3 w-full rounded-full bg-stone-300">
									<div class="bg-accent-500 min-h-3 w-2/3 rounded-full"></div>
								</div>
								<span class="text-xl">65%</span>
							</div>
							<p>Trilha: BPO Financeiro - Modulo X</p>
						</div>
					</div>
				</div>

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
						<div transition:slide={{ duration: 200 }} class="flex w-full flex-col gap-2 px-3 pt-2">
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
			<div class="flex w-full flex-col gap-5 rounded-xl border p-3">
				<h2 class="-mb-3 px-3">Cursos Disponíveis</h2>
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
							<span>10 Vídeos</span>
							&bull;
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
			<div class="rounded-lg border p-5">Banner da Conquer</div>
		</div>
	</div>
{/if}
