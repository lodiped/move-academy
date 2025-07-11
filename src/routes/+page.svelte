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
		firstVisit
	} from '$lib/state.svelte';
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';

	// @ts-ignore
	import Google from 'virtual:icons/mdi/google';

	async function handleGoogleSignIn() {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;
			console.log(user);
		} catch (error) {
			console.error(error);
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
		untrack(() => {
			if (!isLogged.value && firstVisit.value) {
				auth.onAuthStateChanged(async (user) => {
					if (!user) {
						isLogged.value = false;
						isUser.value = false;
						isLoading.value = false;
						console.log('not logged in');
						return;
					}

					const snapshot = await get(child(ref(getDatabase()), '/emails'));
					const employeeData = snapshot.exists() ? snapshot.val() : null;
					isLogged.value = true;
					if (employeeData) {
						isUser.value = true;
						emailsArray.value = Object.entries(employeeData).map(([username, email]) => {
							return email;
						});
						usernamesArray.value = Object.entries(employeeData).map(([username, email]) => {
							return username;
						});
						console.log(emailsArray.value);
						for (let i = 0; i < emailsArray.value.length; i++) {
							if (emailsArray.value[i] === user.email) {
								isUser.value = true;
								console.log(`${user.email} is an employee!`);
								isLoading.value = false;
								currentUsername.value = usernamesArray.value[i];
								goto(`/${currentUsername.value}`);
								return;
							} else {
								console.log(`${user.email} is NOT an employee!`);
							}
						}
					} else {
						console.error('No data available');
						isLoading.value = false;
						return;
					}
				});
			}
		});
	});
</script>

<main class="flex w-full max-w-[90ch] flex-col items-center gap-5">
	<h1>Move Academy</h1>
	<p>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat quo esse sit maxime eius
		asperiores quam natus provident architecto earum numquam, eos tempora amet porro ratione. Neque
		quidem porro maiores. Autem illum provident in quod velit recusandae consequuntur itaque unde
		dolorem voluptatum repudiandae accusamus quae adipisci alias, praesentium libero voluptas.
	</p>
	{#if isLoading.value}
		Loading
	{:else if !isLogged.value}
		<button onclick={handleGoogleSignIn} class="button-base">
			<Google /><span>Entrar</span>
		</button>
	{:else}
		<button class="button-base" onclick={handleGoogleSignOut}>Logout</button>
		<a class="button-base" href="/{currentUsername.value}">Sua Conta</a>
	{/if}
</main>
