import { ref, computed, reactive } from 'vue';
import { defineStore, } from 'pinia';
import _ from 'lodash';

import useConfig from '@stores/useConfig.js';
import useNextCloud from '@stores/useNextCloud.js';
import useStyle from '@stores/useStyle.js';
import useAssets from '@stores/useAssets.js';
export { useConfig, useNextCloud, useStyle, useAssets };

export const useStore = defineStore('store', () => {

	const refs = ref({ extraSettings: null, cover: null });
	const finishedLoading = reactive({ data: false, stopwatches: false, countdowns: false, pizzas: false, pizzabounce:false,pizzatime:false, portfolio: false });
	const loading = reactive({})

	const portfolio = reactive([])
	const fixtext = ref({})
	const imagetotext = ref({})
	const codesandbox = ({ config: {}, filelist: {}, files: {} })

	const stopwatches = ref({});
	const stopwatches_settings = ref({
		updateFrequency: 1000,
	});
	const countdowns = ref({});
	const countdowns_settings = ref({});

	const pizzatime = reactive({})
	const pizzabounce = reactive({
		config: {},
		pizzas: [],
		backgroundImages: {},
	});
	const currentPage = reactive({
		show: false,
		id: null,
		name: null,
	});
	const pages = ref({
		codesandbox: { name: 'Code sandbox', entry: 'codesandbox/index.html' },
		fixtext: { name: 'Fix text', entry: 'fixtext/index.html' },
		stopwatch: { name: 'Stopwatch', entry: 'stopwatch/dist/index.html' },
		images: { name: 'Images', entry: 'images/dist/index.html' },
		pizzabounce: { name: 'pizzabounce', entry: 'pizza/index.html' },
		pizzatime: { name: 'Pizzatime', entry: 'pizzatime/index.html' },
	});

	const state = reactive({
		menuOpen: false,
		selected: '/',
		loading: false,
	});
	function loadingStart(from) {
		if (window.Console) Console.log({ file: 'store.js', func: 'loadingStart' }, from, loading)
		if (!loading[from]) loading[from] = []
		loading[from].push('loading')
		if (document?.body) {
			document.body.classList.add('loading')
		}
		if (window.Console) Console.log({ file: 'store.js', func: 'loadingStart' }, from, loading)
	}
	function loadingFinished(from) {
		if (window.Console) Console.log({ file: 'store.js', func: 'loadingFinished' }, from, loading)
		if (loading[from]) loading[from].shift()
		if (loading[from] && loading[from].length == 0) delete loading[from]
		if (document?.body && Object.keys(loading).length == 0) document.body.classList.remove('loading')

		if (window.Console) Console.log({ file: 'store.js', func: 'loadingFinished' }, from, loading)
	}

	function isReady(key, func) {
		const result = () => {
			if (func && typeof func == 'function') func();
			return true;
		};
		if (useStore().finishedLoading[key]) return result();
		let wait = setInterval(() => {
			if (useStore().finishedLoading[key]) {
				wait = clearInterval(wait);
				return result();
			}
		}, 500);
	}
	const icons = ref({});

	const infoText = {
		sessionStorage: `sessionStorage persists in the browser only when refreshing the website and is contained to this session. `,
		localStorage: `localStorage remains saved in the browser until removed. `,
		nextcloud: `Saves data and settings to your Nextcloud storage`,
	};

	function info(text) {
		alert(text);
		//alert(infoText[key]);
		//const prompt = confirm('To install this app, please follow these steps:\n\n1. Tap the share button in your browser.\n2. Select "Add to Home Screen".\n3. Follow the instructions to add the app to your home screen.');
		//if (prompt) {console.log('User prompted to install PWA');}
	}

	var theInterval;
	const intervals = { second: null };
	const intervalObj = {};
	function startInterval(id, func, start = true) {
		if (window.Console) Console.log({ file: 'store.js' }, 'startInterval', 1, theInterval, id, func, start)
		if (intervalObj.hasOwnProperty(id) && start == false) delete intervalObj[id];
		else if (start == true) intervalObj[id] = func;

		if (Object.keys(intervalObj).length < 1) theInterval = clearInterval(theInterval);
		else if (!theInterval)
			theInterval = setInterval(() => {
				for (const f in intervalObj) {
					if (typeof intervalObj[f] == 'function') intervalObj[f]();
				}
			}, 1000);
		if (window.Console) Console.log({ file: 'store.js' }, 'startInterval', 2, theInterval, id, func, start)
	}

	function log() {
		if (window.Console) Console.log({ file: 'store.js' }, ...arguments)
		return
	}
	const listOrder = reactive({
		stopwatches: [],
		countdowns: []

	})


	return { portfolio, state, pages, icons, isReady, finishedLoading, loading, loadingStart, loadingFinished, stopwatches, countdowns, pizzabounce, pizzatime, intervals, currentPage, infoText, info, startInterval, refs, log, listOrder, stopwatches_settings, countdowns_settings, fixtext, imagetotext, codesandbox };
});

