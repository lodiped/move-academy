<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { getDatabase, ref, onValue } from 'firebase/database';

	const db = getDatabase();
	const offsetRef = ref(db, '.info/serverTimeOffset');

	onValue(offsetRef, (snap) => {
		const offset = snap.val() || 0;
		const serverMs = Date.now() + offset;
		console.log('serverMs', serverMs);
		console.log('serverISO', new Date(serverMs).toISOString());
	});

	let showCumbuca = $state(false);
	import Chevron from 'virtual:icons/mdi/chevron-down';
</script>

<div class="glass-bg flex w-full max-w-[80ch] flex-col items-center gap-2 p-4">
	<button onclick={() => (showCumbuca = !showCumbuca)} class="relative cursor-pointer">
		<h2 class="cool-title">Cumbuca</h2>
		<div class="absolute -right-10 bottom-0 h-full cursor-pointer">
			<Chevron class="text-3xl transition-all {showCumbuca ? 'rotate-180' : ''}" />
		</div>
	</button>
	{#if showCumbuca}
		<div transition:slide>
			<p>Menu para administrar cumbuca</p>
		</div>
	{/if}
</div>
