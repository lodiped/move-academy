import 'dotenv/config';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { getDatabase, ref, get } from './src/lib/firebase.js';

async function listUserEntries() {
	const rootSnap = await get(ref(getDatabase(), '/emails'));
	if (!rootSnap.exists()) return [];

	const rootVal = rootSnap.val();
	const entries = [];

	for (const username of Object.keys(rootVal)) {
		entries.push(`/${username}`);
	}

	return entries;
}

const userEntries = await listUserEntries();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: { adapter: adapter(), prerender: { entries: ['*', ...userEntries] } }
};

export default config;
