<script lang="ts">
	import { page } from '$app/state';
	import { auth, googleProvider } from '$lib/firebase';
	import {
		currentUsername,
		isLogged,
		isUser,
		isAdmin,
		getSector,
		getEnrolled
	} from '$lib/state.svelte';
	import { onMount, untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { isLoading, enrolled } from '$lib/state.svelte';
	import { signInWithPopup, signOut } from 'firebase/auth';

	import Cumbucas from '$lib/components/Cumbucas.svelte';
	import User from '$lib/components/User.svelte';
	import CtaHeader from '$lib/components/CtaHeader.svelte';
	import Matriculados from '$lib/components/Matriculados.svelte';
	import Disponiveis from '$lib/components/Disponiveis.svelte';

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

	//TEMPORARIOOOOOOOOOOOOOOOO

	let disponiveis = {
		a1: {
			titulo: 'BPO Financeiro',
			trilha: true,
			progresso: 0
		},
		'00': {
			titulo: 'Contábil',
			trilha: true,
			progresso: 0
		},
		'01': {
			titulo: 'Contábil',
			trilha: true,
			progresso: 0
		},
		'02': {
			titulo: 'Contábil',
			trilha: true,
			progresso: 0
		},
		'03': {
			titulo: 'Contábil',
			trilha: true,
			progresso: 0
		},
		'04': {
			titulo: 'Contábil',
			trilha: true,
			progresso: 0
		}
	};

	function prettyEnrolled() {
		let prettyEnrolled: any = [];
		for (let i = 0; i < enrolled.value.length; i++) {
			prettyEnrolled.push(disponiveis[enrolled.value[i].id]);
		}
		console.log(prettyEnrolled);
		return prettyEnrolled;
	}

	//TEMPORARIOOOOOOOOOOOOOOOOO

	$effect(() => {
		untrack(async () => {
			currentUsername.value = page.params.username;
			await getSector();
			await getEnrolled();
			prettyEnrolled();
			if (!isLogged.value || (!isUser.value && !isAdmin.value)) {
				console.log('not logged in @movenegocios.com.br account');
				await handleGoogleSignOut();
				goto('/');
				return;
			}
			console.log(`current user: ${auth.currentUser?.email}`);
		});
	});
</script>

<h1 class="cool-title my-5">Move Academy</h1>
{#if currentUsername.value === page.params.username}
	<div class="mb-10 flex w-full flex-col justify-center gap-4 px-3 lg:flex-row">
		<div class="flex w-full max-w-[50ch] flex-col gap-4">
			<User />
			<Cumbucas />
		</div>
		<div class="flex w-full max-w-[80ch] flex-col gap-4">
			<CtaHeader />
			<Matriculados />
			<Disponiveis />
			<div class="glass-bg flex flex-col items-center gap-2 bg-[#d6b600] p-5">
				<p class="w-full text-center font-['Grifter'] font-bold text-black/70">
					Aproveite os cursos da Conquer
				</p>
				<a
					href="https://escolaconquer.com.br"
					target="_blank"
					class="w-fit rounded-lg bg-orange-600 px-4 py-3 font-['Grifter'] text-white/85 shadow-lg transition-transform hover:scale-105"
					>Clique Aqui</a
				>
			</div>
		</div>
	</div>
{/if}
