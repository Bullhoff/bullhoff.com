<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { computed, reactive, onMounted, onBeforeMount } from 'vue';
import { } from '@scripts/scripts.js'
import '@scripts/log.js'
import _ from 'lodash';
import SvgIcons from './components/SvgIcons2.vue';
import TheHeader from './views/TheHeader.vue';
import { useStore, useNextCloud, useConfig, useStyle, useAssets } from '@stores/store.js';


const assetsicons = import.meta.glob('./assets/icons/*.*');
const assetsfonts = import.meta.glob('./assets/fonts/*.*');

const state = reactive({
	hidemenu: false
})

function log() {
	if (window.Console) Console.log({ file: 'App.vue', }, ...arguments)
}


function setVh() {
	// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/	https://stackoverflow.com/a/60229913
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
	log('setVh', vh, document.documentElement)
	//height: calc(var(--vh, 1vh) * 100);
}
window.addEventListener('resize', setVh);

onMounted(async () => {
	const url = new URL(location);
	let hidemenu = url.searchParams.get('hidemenu')
	if (hidemenu == null) hidemenu = url.searchParams.get('nomenu')
	if (hidemenu != null && hidemenu != "false") state.hidemenu = true 

	setVh()
	log('onMounted', hidemenu, state.hidemenu, url.searchParams);
});
onBeforeMount(async () => {
	useStore().loadingStart('onBeforeMount')
	useStore().state.loading = true
	performance.mark("onBeforeMount-started");

	await load('general')
	await load('storage');
	await load('nextcloud');

	load('pizzatime')
	load('stopwatches');
	load('pizzabounce');
	load('countdowns');
	loadCodeSandbox('codesandbox');
	load('fixtext');

	useAssets().loadAssetFolder(assetsfonts);
	useAssets().loadAssetFolder(assetsicons);

	performance.mark("onBeforeMount-finished");
	const measure = performance.measure(`onBeforeMount-started-duration`, `onBeforeMount-started`, `onBeforeMount-finished`,);
	log('onBeforeMount', measure.duration, measure);

	useStore().loadingFinished('onBeforeMount')
});
function applySettings() {
	let conf = useConfig().settings
	if (conf.disableConsole && window.Console) Console.disableNormalConsole()
	if (conf.useConsole && window.Console) Console.enable()
}
async function getStorage(key) {
	let session = await localStorage.getItem(key);
	let local = await sessionStorage.getItem(key);
	let data = {};
	log('getStorage', 1, { session, local })
	if (session) await _.merge(data, await parse(session));
	if (local) await _.merge(data, await parse(local));
	log('getStorage', 2, { session, local, data })
	return data
}
async function loadCodeSandbox() {
	performance.mark(`${'codesandbox'}-load-started`);
	let data = { config: {}, filelist: {}, files: {} }
	let storage = { ...sessionStorage, ...localStorage }

	for (const [key, value] of Object.entries(storage)) {
		let splitted = key.split('/')
		log('loadCodeSandbox', 'storage:', splitted)
		if (splitted.includes('codesandbox')) {
			if (splitted.at(-1) == 'filelist' || splitted.at(-1) == 'config') {
				await _.merge(data[splitted.at(-1)], await parse(value))
			}
			else {
				data.files[splitted.at(-1)] = value
			}
		}
	}
	if (Object.keys(data.filelist).length == 0 && useNextCloud().validLogin && useConfig().storage.codesandbox.nextcloud) {	// 
		let res = await useNextCloud().loadNextCloudData('codesandbox');
		log('loadCodeSandbox', { data, res })
		if (res.config) await _.merge(data.config, await parse(res.config))
		if (res.filelist) await _.merge(data.filelist, await parse(res.filelist))
		if (res.files) await _.merge(data.files, await parse(res.files))
	}
	await _.merge(useStore().codesandbox, data)
	log('loadCodeSandbox', useStore().codesandbox)
	useStore().finishedLoading['codesandbox'] = true;
	performance.mark(`${'codesandbox'}-load-finished`);
	const measure = performance.measure(`${'codesandbox'}-load-duration`, `${'codesandbox'}-load-started`, `${'codesandbox'}-load-finished`,);
	log('performance', 'codesandbox', measure.duration, measure);
}

async function load(key) {
	performance.mark(`${key}-load-started`);
	log('load', key);
	let data = await getStorage(key)
	let res
	log('load', key, data)

	if (key == 'storage') {
		await _.merge(useConfig().storage, data);
	} else if (key == 'nextcloud') {
		await _.merge(useNextCloud().nextcloud, data);
	} else {
		if(useNextCloud().validLogin && useConfig().storage[key]?.nextcloud) res = await useNextCloud().loadNextCloudData(key);
		//if ((!data || (data&&Object.keys(data).length==0)) && useNextCloud().validLogin && useConfig().storage[key]?.nextcloud) res = await useNextCloud().loadNextCloudData(key);
		if (res) await _.merge(data, await parse(res));

		if (key == 'general') {
			await _.merge(useConfig().settings, data);
			await applySettings()
		}
		else await _.merge(useStore()[key], data);
		useStore().finishedLoading[key] = true;
	}
	performance.mark(`${key}-load-finished`);
	log('load', key, data);
	const measure = performance.measure(`${key}-load-duration`, `${key}-load-started`, `${key}-load-finished`,);
	log('performance', key, measure.duration, measure);
}


function parse(value) {
	try {
		return JSON.parse(value);
	} catch (err) {
		log('parseerror', value);
		return {};
	}
}




</script>

<template>
	<div id="shades" style="position:fixed; width:100%; height:100%; z-index: 999999; pointer-events: none; background-color: black;" :style="{ opacity: (useConfig().settings.shadeOpacity) ? useConfig().settings.shadeOpacity / 100 : 0, }"></div>
	<Cover :ref="(el) => (useStore().refs.cover = el)" />
	<div id="messageBoard" class="message-board" :ref="(el) => useStyle().refs.messageBoard = el"></div>
	<SvgIcons />

	<header id="header" :ref="(el) => (useStyle().refs.topmenu = el)" v-show="state.hidemenu == false">
		<TheHeader />
	</header>
	<main id="main" :ref="(el) => (useStyle().refs.main = el)">
		<RouterView />
	</main>
</template>

<style lang="scss">

* {
	margin: 0;
	box-sizing: border-box;
}

#app {
	display: flex;
	flex-direction: column;
	font-weight: normal;
	height: 100vh;
	height: calc(var(--vh, 1vh) * 100);
}

#main {
	flex-grow: 1;
	overflow: auto;
	padding: 1ch;
	max-height: calc(var(--vh, 1vh) * 100);
}

#header {
	flex-shrink: 0;
	z-index: 999;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	background-color: #101010;
	overflow: hidden;
	border-bottom: 3px solid chocolate;
	align-items: center;
	padding: 5px;
	width: 100%;
	height: fit-content;
}
</style>
