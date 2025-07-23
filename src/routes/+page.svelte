<script lang="ts">
	import { signInWithPopup, signOut } from 'firebase/auth';
	import { auth, googleProvider, get, child, ref, getDatabase } from '$lib/firebase';
	import {
		isUser,
		isLogged,
		emailsArray,
		currentUsername,
		isLoading,
		usernamesArray,
		firstVisit,
		toLogin,
		authStuff
	} from '$lib/state.svelte';
	import { untrack } from 'svelte';
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

	$effect(() => {
		untrack(async () => {
			if (isLogged.value) goto(`/${currentUsername.value}`);
			await authStuff();
		});
	});
</script>

<main class="flex w-full max-w-[90ch] flex-col items-center gap-5">
	{#if isLoading.value}
		isLoading
	{/if}
	<h1>Move Academy</h1>
	{#if isLoading.value}
		Carregando...
	{:else if !isLogged.value}
		<button onclick={handleGoogleSignIn} class="button-base">
			<Google /><span>Entrar</span>
		</button>
	{:else}
		<button class="button-base" onclick={handleGoogleSignOut}>Logout</button>
		<a class="button-base" href="/{currentUsername.value}">Sua Conta</a>
	{/if}
</main>
