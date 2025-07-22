import { auth, get, child, ref, getDatabase } from '$lib/firebase.js';
import { goto } from '$app/navigation';
export const isAdmin = $state({ value: false });
export const isUser = $state({ value: false });
export const isLogged = $state({ value: false });
export const isLoading = $state({ value: true });
export const firstVisit = $state({ value: true });

export const usernamesArray: any = $state({ value: [] });
export const emailsArray: any = $state({ value: [] });
export const toLogin = $state({ value: false });

export const currentUsername = $state({ value: '' });

if (!isLogged.value) {
	auth.onAuthStateChanged(async (user) => {
		firstVisit.value = false;
		isLoading.value = true;
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
					currentUsername.value = usernamesArray.value[i];
				}
			}
			if (currentUsername.value) {
				isLoading.value = false;
				goto(`/${currentUsername.value}`);
				return;
			} else {
				toLogin.value = true;
			}
		} else {
			console.error('No data available');
			isLoading.value = false;
			return;
		}
	});
} else {
	goto(`/${currentUsername.value}`);
}

export const namesConvert: any = $state({
	amandacastro: 'Amanda Castro',
	andrecastro: 'Andre Castro',
	andreussiegrist: 'Andreus Siegrist',
	asaphtavares: 'Asaph Tavares',
	carolbarros: 'Caroline Barros',
	cassiarodrigues: 'Cassia Rodrigues',
	pedrolodi: 'Pedro Lodi',
	thiagorosa: 'Thiago Rosa'
});
