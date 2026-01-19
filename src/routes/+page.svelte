<script lang="ts">
	import { onMount } from 'svelte';
	import { signInWithPopup, signOut } from 'firebase/auth';
	import { auth, googleProvider } from '$lib/firebase';
	import {
		isUser,
		isLogged,
		currentUsername,
		isLoading,
		isAdmin,
		emailsArray,
		usernamesArray,
		getAuth
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
			getAuth().then(() => {
				isLoading.value = false;
				routingStuff();
			});
		} catch (error) {
			console.error(error);
			isLoading.value = false;
		}
	}

	async function handleGoogleSignOut() {
		try {
			await signOut(auth);
			isLogged.value = false;
			isUser.value = false;
			isAdmin.value = false;
			currentUsername.value = '';
			emailsArray.value = [];
			usernamesArray.value = [];
			console.log('logging out and resetting vars');
			goto('/');
			return;
		} catch (error) {
			console.error(error);
		}
	}

	function routingStuff() {
		console.log('routingStuff in running');
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

	onMount(() => {
		getAuth().then(() => {
			console.log('onMount -> then running?');
			routingStuff();
		});
	});

	// $effect(() => {
	// 	// untrack(() => routingStuff());
	// 	routingStuff();
	// });
</script>

<main class="flex w-full max-w-[90ch] flex-col items-center gap-5">
	<h1>Move Academy</h1>
	{#if isLoading.value}
		Carregando
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
