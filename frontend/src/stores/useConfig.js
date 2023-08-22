import {ref, computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import _ from 'lodash';
import * as nc from '@scripts/nextcloud/nextcloud.js';
import * as store from '@stores/store.js';
function parse(value) {
	try {
		return JSON.parse(value);
	} catch (err) {
		console.log('parseerror', value);
		return {};
	}
}

export default defineStore('config', () => {
	const settings = reactive({
		debug:false, 
		useConsole: false, 
		shadeOpacity: 0, 
	})
	const storage = reactive({
		general: {localStorage: true, sessionStorage: false, nextcloud: true},
		nextcloud: {localStorage: false, sessionStorage: true},
		stopwatches: {localStorage: true, sessionStorage: false, nextcloud: true},
		countdowns: {localStorage: true, sessionStorage: false, nextcloud: true},
		pizzaspin: {},
		pizzabounce: {localStorage: true, sessionStorage: false, nextcloud: false},
		pizzatime: {localStorage: true, sessionStorage: false, nextcloud: false},
		fixtext: {localStorage: true, sessionStorage: false, nextcloud: true},
		imagetotext: {},
		codesandbox: {localStorage: true, sessionStorage: false, nextcloud: true},
		
	});
	function save(key, value, subkey) {
		if(key == 'codesandbox' && !subkey){
			let {filelist, file, code, config} = value
			store.useStore().log('save', {filelist, file, code, config})
			if(config) save(key, config, `/codesandbox/config`)
			if(file && code) {
				save(key, code, `/codesandbox/files/${file}`)	// `${file}.html`
				if (storage[key].nextcloud) filelist[file].saved = true
			}
			if(filelist) {
				save(key, filelist, `/codesandbox/filelist`)	// .json
				_.merge(store.useStore().codesandbox, filelist)
			}
		} else {
			if(!subkey) subkey = key
			if (typeof value == 'object') value = JSON.stringify(value);
			if (storage[key].localStorage) localStorage.setItem(subkey, value, );
			if (storage[key].sessionStorage) sessionStorage.setItem(subkey, value, );
			if (storage[key].nextcloud) store.useNextCloud().saveFile(key, value, subkey);
		}
		
	}
	const windowTitle = ref({
		//default: '',
		stopwatch: null,	// \u23F1
		alarm: null,
	});
	function setWindowTitle(key, value) {
		windowTitle.value[key] = value;
		let str = Object.values(windowTitle.value)
			.reduce((a, c) => {
				if (c) a.push(c);
				return a;
			}, [])
			.join(' - ');
		if (str == '') document.title = 'Bullhoff';
		else document.title = str;
	}

	
	

	return {storage, setWindowTitle, save, settings};
});