import { auth, get, child, ref, getDatabase } from '$lib/firebase.js';
import { page } from '$app/state';
import { goto } from '$app/navigation';
export const isAdmin = $state({ value: false });
export const isUser = $state({ value: false });
export const isLogged = $state({ value: false });
export const isLoading = $state({ value: true });
export const firstVisit = $state({ value: true });

export const usernamesArray: any = $state({ value: [] });
export const emailsArray: any = $state({ value: [] });

export const currentUsername = $state({ value: '' });

export const sector = $state({ value: '' });

export const authStuff = async () => {
	console.log('authStuff', isLogged.value);
	if (!isLogged.value) {
		auth.onAuthStateChanged(async (user) => {
			firstVisit.value = false;
			isLoading.value = true;
			if (!user) {
				isLogged.value = false;
				isUser.value = false;
				isLoading.value = false;
				isAdmin.value = false;
				console.log('not logged in');
				return;
			}

			const uid = user.uid;
			console.log(uid);
			try {
				if (emailsArray.value.length === 0 || usernamesArray.value.length === 0) {
					const adminSnap = await get(child(ref(getDatabase()), `/admin/${uid}`));
					const snapshot = await get(child(ref(getDatabase()), '/emails'));
					const userData = snapshot.exists() ? snapshot.val() : null;
					if (userData) {
						if (adminSnap.exists()) {
							isAdmin.value = true;
							isUser.value = false;
							console.log('IS ADMIN');
						} else {
							isAdmin.value = false;
							isUser.value = true;
						}
						emailsArray.value = Object.entries(userData).map(([username, email]) => {
							return email;
						});
						usernamesArray.value = Object.entries(userData).map(([username, email]) => {
							return username;
						});
						console.log(emailsArray.value);
						for (let i = 0; i < emailsArray.value.length; i++) {
							if (emailsArray.value[i] === user.email) {
								currentUsername.value = usernamesArray.value[i];
							}
						}
					} else {
						console.error('No data available');
						isLoading.value = false;
						return;
					}
				}
				isLogged.value = true;
				isLoading.value = false;
				console.log('is logged in');
			} catch (error) {
				console.error(error);
			}
		});
	} else {
		if (currentUsername.value) {
			goto(`/${currentUsername.value}`);
		} else {
			goto('/');
		}
	}
};

export const namesConvert: any = $state({
	pedroloditeste: 'Pedro Lodi',
	amandacastro: 'Amanda Castro',
	andrecastro: 'Andre Castro',
	andreussiegrist: 'Andreus Siegrist',
	asaphtavares: 'Asaph Tavares',
	carolbarros: 'Caroline Barros',
	cassiarodrigues: 'Cassia Rodrigues',
	eduardoditrich: 'Eduardo Ditrich',
	eliseucararo: 'Eliseu Cararo',
	ewertondubiela: 'Ewerton Dubiela',
	fernandafrandoloso: 'Fernanda Frandoloso',
	fernandogranciano: 'Fernando Granciano',
	francielyoliveira: 'Franciely Oliveira',
	heloisasilva: 'Heloisa Silva',
	jessicanunes: 'Jessica Nunes',
	joaomariano: 'João Mariano',
	kamilaendo: 'Kamila Endo',
	ketelinnascimento: 'Ketelin Nascimento',
	larissamartins: 'Larissa Martins',
	leonardosilva: 'Leonardo Silva',
	leticiaguidolin: 'Leticia Guidolin',
	lincolngomes: 'Lincoln Gomes',
	lucaseyng: 'Lucas Eyng',
	luizfaquim: 'Luiz Faquim',
	maluwienen: 'Malu Wienen',
	michaelhening: 'Michael Hening',
	pedrolodi: 'Pedro Lodi',
	rafaelwolski: 'Rafael Wolski',
	robersoncorrea: 'Roberson Correa',
	tamirisrosa: 'Tamiris Rosa',
	thiagolopes: 'Thiago Lopes',
	thiagorosa: 'Thiago Rosa',
	valdineisilva: 'Valdinei Silva'
});

export const booksArray: any = $state({ value: [] });
export const currentCumbucaObject: any = $state({ value: 0 });

export async function getBooks() {
	try {
		const response = await get(ref(getDatabase(), '/cumbuca'));
		if (!response.exists()) {
			throw new Error("Couldn't get data at /cumbuca");
		}
		let snap = response.val();
		const { livros, currentCumbuca } = snap;

		if (!livros || typeof livros !== 'object') {
			console.error(livros);
			throw new Error('livros is not an object');
		}
		booksArray.value = Object.entries(livros).map(([key, value]) => {
			return value;
		});
		currentCumbucaObject.value = currentCumbuca;
	} catch (error) {
		console.error('getBooks failed:', error);
		throw error;
	}
}

export async function getSector() {
	if (isLogged.value) {
		try {
			if (currentUsername.value !== page.params.username)
				throw new Error('currentUsername.value !== page.params.username');
			const res = await get(ref(getDatabase(), 'users/' + currentUsername.value + '/setor'));
			if (!res.exists()) {
				throw new Error("Couldn't get data at /users/" + currentUsername.value + '/setor');
			}
			const snap = res.val();
			if (snap) {
				sector.value = snap;
			}
			console.log(sector.value);
		} catch (err) {
			console.error(err);
			throw err;
		}
	} else {
		goto('/');
	}
}

export const enrolled: any = $state({ value: [] });

export async function getEnrolled() {
	try {
		const res = await get(ref(getDatabase(), 'users/' + currentUsername.value + '/matriculado'));
		if (!res.exists()) {
			throw new Error("Couldn't get data at /users/" + currentUsername.value + '/matriculado');
		}
		const snap = res.val();
		if (snap) {
			enrolled.value = parseEnrolled(snap);
		}
		console.log(enrolled.value);
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export function parseEnrolled(enrolled: string) {
	const re = /(.{2})(\d{3})/g;
	const result = [];
	let m;
	while ((m = re.exec(enrolled)) !== null) {
		const id = m[1];
		const progress = parseInt(m[2]);
		result.push({ id, progress: Math.max(0, Math.min(100, progress)) });
	}
	return result;
}
