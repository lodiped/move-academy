<script lang="ts">
	import { slide } from 'svelte/transition';

	// @ts-ignore
	import Check from 'virtual:icons/mdi/check-circle-outline';
	// @ts-ignore
	import Lock from 'virtual:icons/mdi/lock';
	// @ts-ignore
	import Chevron from 'virtual:icons/mdi/chevron-down';
	// @ts-ignore
	import Play from 'virtual:icons/mdi/play';

	let trilhaTest = $state(false);
</script>

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
