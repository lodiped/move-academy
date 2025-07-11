import { auth, get, child, ref, getDatabase } from '$lib/firebase.js';
export const isAdmin = $state({ value: false });
export const isUser = $state({ value: false });
export const isLogged = $state({ value: false });
export const isLoading = $state({ value: true });
export const firstVisit = $state({ value: true });

export const usernamesArray: any = $state({ value: [] });
export const emailsArray: any = $state({ value: [] });

export const currentUsername = $state({ value: '' });

if (!isLogged.value) {
	auth.onAuthStateChanged(async (user) => {
		if (!user) {
			isLogged.value = false;
			isUser.value = false;
			isLoading.value = false;
			console.log('not logged in');
			return;
		}

		if (emailsArray.value.length !== 0) {
			console.log('EMAILS ARRAY NOT EMPTYYYYYYYYYYYYYYYYYYY');
			isLogged.value = true;
			for (let i = 0; i < emailsArray.value.length; i++) {
				if (emailsArray.value[i] === user.email) {
					isUser.value = true;
					console.log(`${user.email} is an employee!`);
					isLoading.value = false;
					currentUsername.value = usernamesArray.value[i];
					return;
				} else {
					console.log(`${user.email} is NOT an employee!`);
				}
			}
		} else {
			const snapshot = await get(child(ref(getDatabase()), '/emails'));
			console.log('ITS CALLING THE DB');
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
		}
	});
}

export const namesConvert: any = $state({ pedrolodi: 'Pedro Lodi', thiagorosa: 'Thiago Rosa' });
