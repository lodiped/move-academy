import { auth, get, child, ref, getDatabase } from '$lib/firebase.js';
import { goto } from '$app/navigation';
export const isAdmin = $state({ value: false });
export const isUser = $state({ value: false });
export const isLogged = $state({ value: false });
export const isLoading = $state({ value: true });
export const firstVisit = $state({ value: true });

export const usernamesArray: any = $state({ value: [] });
export const emailsArray: any = $state({ value: [] });

export const currentUsername = $state({ value: '' });

export const authStuff = async () => {
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
			} catch (error) {
				console.error(error);
			}
		});
	} else {
		goto(`/${currentUsername.value}`);
	}
};

export const namesConvert: any = $state({
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
