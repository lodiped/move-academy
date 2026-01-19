<script lang="ts">
	import { slide } from 'svelte/transition';

	let showUsers = $state(false);

	let usersOrdered = $state([
		{
			name: 'Pedro Henrique Lodi',
			setor: 'Admin',
			progresso: 60
		},
		{
			name: 'Thiago Silva',
			setor: 'Marketing',
			progresso: 80
		}
	]);
	import Chevron from 'virtual:icons/mdi/chevron-down';
	import Gear from 'virtual:icons/mdi/gear';
	import Trash from 'virtual:icons/mdi/trash-can-outline';
</script>

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
			<table class="w-full table-fixed">
				<thead class="border-b">
					<tr class="text-left">
						<th class="w-[60%]">Nome Completo</th>
						<th class="w-[30%]">Setor</th>
						<th class="w-[30%]">Progresso</th>
						<th class="w-[10%]">Ações</th>
					</tr>
				</thead>
				<tbody>
					{#each usersOrdered as user, i}
						<tr class="border-b border-white/20 text-nowrap">
							<td class="overflow-hidden py-2 pr-2 overflow-ellipsis">
								{user.name}
							</td>
							<td class="overflow-hidden pr-2 overflow-ellipsis">{user.setor}</td>
							<td class="overflow-hidden pr-2 overflow-ellipsis">{user.progresso}%</td>
							<td>
								<button class="translate-y-1 cursor-pointer"><Gear /></button>
								<button class="translate-y-1 cursor-pointer hover:text-red-600"><Trash /></button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
