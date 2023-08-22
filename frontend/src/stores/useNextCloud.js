import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import _ from 'lodash';
import * as nc from '@scripts/nextcloud/nextcloud.js';
import * as store from '@stores/store.js';

export default defineStore('nextcloud', () => {
	async function logout() {
		nextcloud.user = null;
		nextcloud.token = null;
	}
	async function login() {
		let usernameAndToken = await nc.poller({ domain: nextcloud.domain });
		let { Token, User } = usernameAndToken;
		if (validLogin.value) store.useStyle().postMessage(`Logged in`)
		nextcloud.user = User;
		nextcloud.token = Token;
		saveConfig();
	}

	function saveConfig() {
		if (store.useConfig().storage.nextcloud.localStorage && validLogin.value) {
			localStorage.setItem('nextcloud', JSON.stringify(nextcloud));
		} else if (validLogin.value) {
			localStorage.removeItem('nextcloud');
		}
		if (store.useConfig().storage.nextcloud.sessionStorage && validLogin.value) {
			sessionStorage.setItem('nextcloud', JSON.stringify(nextcloud));
		} else if (validLogin.value) {
			sessionStorage.removeItem('nextcloud');
		}
		localStorage.setItem('storage', JSON.stringify(store.useConfig().storage));
	}
	const nextcloud = reactive({
		user: null,
		token: null,
		domain: 'https://vera.se.tab.digital',
		folder: '/bullhoff',
	});


	async function loadCodeSandbox() {
		let { baseUrl, folder } = await getRequestUrl()
		let obj = {
			config: await nc.getFile(baseUrl, folder, '/codesandbox/config.json', nextcloud.token),
			filelist: await nc.getFile(baseUrl, folder, '/codesandbox/filelist.json', nextcloud.token),
		}

		return obj
	}
	async function loadNextCloudData(key, ext) {
		if (ext == undefined) ext = '.json'
		if (key == 'codesandbox') {
			return loadCodeSandbox()

		}
		if (!nextcloud.user || !nextcloud.token) return;
		//let url = nextcloud.domain + '/remote.php/dav/files/' + nextcloud.user + '/' + nextcloud.folder + '/stopwatches.json'; //encodeURIComponent(folder + '/stopwatches.json')
		let { baseUrl, folder, file } = await getRequestUrl(key, ext);
		let res = await nc.getFile(baseUrl, folder, file, nextcloud.token);
		return res
	}
	async function deleteFile(key, ext = '.html', subkey) {
		store.useStore().log('deleteFile', key, ext, subkey)
		if (!subkey) subkey = key
		if (store.useConfig().storage[key].nextcloud && validLogin.value) {
			let { baseUrl, folder, file } = await getRequestUrl(subkey, ext);
			store.useStore().log('deleteFile', key, ext, subkey, { baseUrl, folder, file })
			nc.deleteFile(baseUrl, folder, file, nextcloud.token,);
		}
	}
	async function saveFile(key, value, subkey) {
		if (!subkey) subkey = key
		let ext = '.json'
		let splitted = subkey.split('.')
		if (splitted.length > 1) {
			ext = '.' + splitted.pop()
			subkey = splitted.join('.')
		}
		if (store.useConfig().storage[key].nextcloud && validLogin.value) {
			let { baseUrl, folder, file } = await getRequestUrl(subkey, ext);
			store.useStore().log('useNextCloud.saveFile', 3, { baseUrl, folder, file })
			nc.saveFile(baseUrl, folder, file, nextcloud.token, value);
		}
	}

	const validLogin = computed(() => {
		if (nextcloud.user == null) return false;
		if (nextcloud.token == null) return false;
		return true;
	});

	const urlNextCloud = computed(() => {
		if (!nextcloud.user || !nextcloud.token || nextcloud.domain) return null;
		let url = nextcloud.domain + '/remote.php/dav/files/' + nextcloud.user + '/' + nextcloud.folder + '/';
		return url;
	});
	const urlFile = computed(() => {
		if (!nextcloud.user || !nextcloud.token || nextcloud.domain) return null;
		let url = nextcloud.domain + '/remote.php/dav/files/' + nextcloud.user + '/' + nextcloud.folder + '/';
		return url;
	});
	function getRequestUrl(file = '', ext = '.json') {
		return {
			baseUrl: nextcloud.domain + '/remote.php/dav/files/' + nextcloud.user + '/',
			folder: nextcloud.folder,
			file: file + ext,
		};
	}
	return { nextcloud, validLogin, urlNextCloud, urlFile, login, logout, saveConfig, getRequestUrl, loadNextCloudData, saveFile, deleteFile };
});