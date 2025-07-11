import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref, get, child } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyBiMEjY3ep2D6lepuN20rfPwrtzdZfP0Oo',
	authDomain: 'moveacademydb.firebaseapp.com',
	projectId: 'moveacademydb',
	storageBucket: 'moveacademydb.firebasestorage.app',
	messagingSenderId: '943168284392',
	appId: '1:943168284392:web:1c3a2a15ca42b8aa540b5d',
	databaseURL: 'https://moveacademydb-default-rtdb.firebaseio.com'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export { ref, get, child, getDatabase };
