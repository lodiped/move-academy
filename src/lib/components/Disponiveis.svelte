<script lang="ts">
	// @ts-ignore
	import Chevron from 'virtual:icons/mdi/chevron-down';
	// @ts-ignore
	import Play from 'virtual:icons/mdi/play';
	// @ts-ignore
	import Dots from 'virtual:icons/mdi/dots-horizontal';
</script>

<div class="glass-bg flex w-full flex-col gap-5 p-3">
	<h2 class="cool-title -mb-3 px-3">Cursos Disponíveis</h2>
	<button class="group inset-button mx-3 flex cursor-pointer justify-between gap-4 p-4 px-6">
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
	<button class="group high-button mx-3 flex cursor-pointer justify-between gap-4 p-4 px-6">
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
	<button class="group high-button mx-3 flex cursor-pointer justify-between gap-4 p-4 px-6">
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
	<button class="group high-button mx-3 flex cursor-pointer justify-between gap-4 p-4 px-6">
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
	<button class="group high-button mx-3 flex cursor-pointer justify-between gap-4 p-4 px-6">
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
