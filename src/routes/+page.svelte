<script lang="ts">
	import { untrack } from 'svelte';
	import { signInWithPopup, signOut } from 'firebase/auth';
	import { auth, googleProvider, get, child, ref, getDatabase } from '$lib/firebase';
	import {
		isUser,
		isLogged,
		currentUsername,
		isLoading,
		authStuff,
		isAdmin
	} from '$lib/state.svelte';
	import { goto } from '$app/navigation';

	// @ts-ignore
	import Google from 'virtual:icons/mdi/google';

	async function handleGoogleSignIn() {
		isLoading.value = true;
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;
			console.log(user);
			isLoading.value = false;
		} catch (error) {
			console.error(error);
			isLoading.value = false;
		}
	}

	async function handleGoogleSignOut() {
		try {
			await signOut(auth);
		} catch (error) {
			console.error(error);
		} finally {
			isLogged.value = false;
			isUser.value = false;
			return;
		}
	}

	async function routingStuff() {
		console.log('routingStuff in running');
		await authStuff();
		if (isLogged.value) {
			if (isUser.value) {
				goto(`/${currentUsername.value}`);
				return;
			}
			if (isAdmin.value) {
				goto('/admin');
				return;
			}
			throw new Error("Couldn't route user");
		}
	}

	$effect(() => {
		// untrack(() => routingStuff());
		routingStuff();
	});
</script>

<main class="flex w-full max-w-[90ch] flex-col items-center gap-5">
	<h1>Move Academy</h1>
	{#if isLoading.value}
		isLoading
	{/if}
	{#if isLoading.value}
		Bem-vindo ao Move Academy
	{:else if !isLogged.value}
		<button onclick={handleGoogleSignIn} class="button-base">
			<Google /><span>Entrar</span>
		</button>
	{:else}
		<button class="button-base" onclick={handleGoogleSignOut}>Logout</button>
		<a class="button-base" href="/{currentUsername.value}">Sua Conta</a>
		{#if isAdmin.value}
			<a href="/admin" class="button-base">Painel Admin</a>
		{/if}
	{/if}
</main>
