<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAdmin } from '$lib/state.svelte';
	import { auth } from '$lib/firebase';

	$effect(() => {
		untrack(() => {
			console.log(`current user: ${auth.currentUser?.email}`);
			if (!isAdmin.value) {
				goto('/');
				console.log('effect in untrack is HIT to isAdmin === false');
			} else {
				console.log('effect in untrack is HIT to isAdmin === true');
			}
		});
	});
</script>

{#if isAdmin.value}
	<main>this is Admin</main>
{/if}
