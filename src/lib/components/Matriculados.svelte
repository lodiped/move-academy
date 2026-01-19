<script lang="ts">
	import { slide } from 'svelte/transition';

	import Check from 'virtual:icons/mdi/check-circle-outline';
	import Lock from 'virtual:icons/mdi/lock';
	import Chevron from 'virtual:icons/mdi/chevron-down';
	import Play from 'virtual:icons/mdi/play';

	//TODO: Funcao para passar o brilho de uma vez pelo progress bar. Ela precisa criar o elemento e depois deletar

	let trilhaTest = $state(false);
	function addShine(i: any) {
		console.log('addShine');
		const progressBar = document.querySelector(`#item` + i);
		const shine = document.createElement('div');
		shine.classList.add('shine');
		shine.classList.add('-left-[70px]');
		progressBar?.appendChild(shine);
		shine.classList.replace('-left-[70px]', 'left-[100%]');
		setTimeout(() => {
			shine.remove();
		}, 2000);
	}
</script>

<div class="glass-bg flex w-full flex-col gap-5 p-3 pb-6">
	<h2 class="cool-title -mb-3 px-3">Cursos matriculados</h2>

	<div class="flex w-full flex-col px-3 transition-all">
		<button
			onclick={() => {
				trilhaTest = !trilhaTest;
				addShine(1);
			}}
			class="group flex w-full cursor-pointer items-center gap-4 p-4 px-6 transition-all {trilhaTest
				? 'inset-button'
				: 'high-button'}"
		>
			<div class="flex w-2/3 justify-between gap-2">
				<span class="font-['Grifter'] text-xl text-gray-200">Trilha: BPO Financeiro</span>
				<span class="opacity-50">Módulo X</span>
			</div>
			<div class="flex w-1/3 items-center gap-2">
				<div
					class="group inset-button relative flex h-fit min-h-7 w-full items-center justify-start gap-2 rounded-full px-2.5"
				>
					<div class="progress-bar relative overflow-hidden" id="item1" style="width: 65%"></div>
				</div>
				<span class="min-w-[4ch] text-start font-['Grifter'] text-sm">65%</span>
			</div>
			<div class="flex items-center justify-center text-2xl">
				<Chevron class="transition-all {trilhaTest ? 'rotate-180' : ''}" />
			</div>
		</button>
		{#if trilhaTest}
			<div
				transition:slide={{ duration: 200 }}
				class="mx-3 flex w-auto flex-col gap-3 rounded-b-lg p-3 px-5"
			>
				<div class="flex items-center justify-between gap-2 opacity-50">
					<div class="flex w-full items-center gap-2">
						<Check class="text-green-500" />
						<span>Título do video 1</span>
					</div>
					<span class="font-['Grifter'] text-sm">45:00</span>
					<div class="flex w-full max-w-1/3 items-center gap-2">
						<div
							class="group inset-button relative flex h-fit min-h-7 w-full items-center justify-start gap-2 rounded-full px-2.5"
						>
							<div class="progress-bar-full" style="width: 100%"></div>
						</div>
						<span class="min-w-[4ch] text-start font-['Grifter'] text-sm">100%</span>
					</div>
				</div>
				<div class="flex items-center justify-between gap-2 opacity-50">
					<div class="flex w-full items-center gap-2">
						<Check class="text-green-500" />
						<span>Título do video 2</span>
					</div>
					<span class="font-['Grifter'] text-sm">33:33</span>
					<div class="flex w-full max-w-1/3 items-center gap-2">
						<div
							class="group inset-button relative flex h-fit min-h-7 w-full items-center justify-start gap-2 rounded-full px-2.5"
						>
							<div class="progress-bar-full" style="width: 100%"></div>
						</div>
						<span class="min-w-[4ch] text-start font-['Grifter'] text-sm">100%</span>
					</div>
				</div>
				<div class="flex items-center justify-between gap-2">
					<div class="flex w-full items-center gap-2">
						<Play />
						<span>Título do video 3</span>
					</div>
					<span class="font-['Grifter'] text-sm">1:05:04</span>
					<div class="flex w-full max-w-1/3 items-center gap-2">
						<div
							class="group inset-button relative flex h-fit min-h-7 w-full items-center justify-start gap-2 rounded-full px-2.5"
						>
							<div class="progress-bar" style="width: 65%"></div>
						</div>
						<span class="min-w-[4ch] text-start font-['Grifter'] text-sm">65%</span>
					</div>
				</div>
				<div class="text-accent-700 flex items-center justify-between gap-2">
					<div class="relative w-full items-center gap-2">
						<span>Título do video 4</span>
						<div
							class="absolute top-0 left-0 flex h-full w-full items-center justify-center opacity-50"
						>
							<Lock />
						</div>
					</div>
					<span class="font-['Grifter'] text-sm">1:05:04</span>
					<div class="flex w-full max-w-1/3 items-center gap-2">
						<div
							class="group inset-button relative flex h-fit min-h-7 w-full items-center justify-start gap-2 rounded-full px-2.5"
						>
							<div class="progress-bar" style="width: 0%"></div>
						</div>
						<span class="min-w-[4ch] text-start font-['Grifter'] text-sm">0%</span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<button class="group high-button mx-3 flex cursor-pointer gap-4 p-4 px-6">
		<div class="flex w-2/3 justify-between gap-2">
			<span class="font-['Grifter'] text-xl text-gray-200">Trilha: Contábil</span>
			<span class="opacity-50">Completo</span>
		</div>
		<div class="flex w-1/3 items-center justify-start gap-2">
			<div
				class="group inset-button relative flex h-fit min-h-7 w-full items-center justify-start gap-2 rounded-full px-2.5"
			>
				<div class="progress-bar-full relative overflow-hidden" style="width: 100%">
					<div
						class="bg-linear absolute top-0 -left-[70px] h-full w-[60px] bg-linear-90 from-transparent via-white to-transparent transition-all duration-1000 group-hover:left-[100%]"
					></div>
				</div>
			</div>
			<span class="min-w-[4ch] text-start font-['Grifter'] text-sm">100%</span>
		</div>
		<div class="flex items-center justify-center text-2xl">
			<Chevron />
		</div>
	</button>
	<button class="group high-button relative mx-3 flex cursor-pointer gap-4 p-4 px-6">
		<div
			class="absolute top-0 flex h-full -translate-x-10 items-center text-xl opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
			transition:slide
		>
			<Play />
		</div>
		<div class="flex w-2/3 justify-between gap-2 transition-all group-hover:translate-x-10">
			<span class="font-['Grifter'] text-xl text-gray-200">Treinamento Qualquer</span>
		</div>
		<div class="flex w-1/3 items-center justify-start gap-2">
			<div
				class="group inset-button relative flex h-fit min-h-7 w-full items-center justify-start gap-2 rounded-full px-2.5"
			>
				<div class="progress-bar-full relative overflow-hidden" style="width: 100%">
					<div
						class="bg-linear absolute top-0 -left-[70px] h-full w-[60px] bg-linear-90 from-transparent via-white to-transparent transition-all duration-1000 group-hover:left-[100%]"
					></div>
				</div>
			</div>
			<span class="min-w-[4ch] text-start font-['Grifter'] text-sm">100%</span>
		</div>
	</button>
</div>
