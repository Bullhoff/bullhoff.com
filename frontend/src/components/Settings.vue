<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useStore, useNextCloud, useConfig, useStyle, useAssets } from './../stores/store.js';
import { onMounted, reactive } from 'vue';
import { SvgQuestionMark, SvgBin } from './SvgIcons.vue';
import { capitalize } from '@scripts/scripts.js';
import { PizzaSparkle } from '@scripts/pizzasparkle.js';
import { ChuckNorris } from '@scripts/chucknorris.js';
import '@scripts/pizzapower.js';
import pizzapng from './../assets/pizza/icon512.png';

const refs = reactive({ wrapper: null, chuck: null });


onMounted(() => {
	useStyle().getStyles();
	new ChuckNorris(refs.chuck);
});
function storageCheckboxChange(e, key, storage, obj) {
	console.log('onChange', key, e);
	let str = (key == 'nextcloud') ? JSON.stringify(useNextCloud().nextcloud) : JSON.stringify(useStore()[key])
	//useStore().storage[key]

	if (e.target.checked) {
		useConfig().save(key, JSON.stringify(str));
	} else {
		if (storage == 'nextcloud') {
			useNextCloud().deleteFile(key)
		}
		else window[storage].removeItem(key);
	}
	localStorage.setItem('storage', JSON.stringify(useConfig().storage));
}
function valuesToFalse(obj) {
	for (const [key, value] of Object.entries(obj)) {
		obj[key] = false;
	}
}


function fontSizeChange(e, part) {
	console.log('fontSizeChange', e.target.value, part);
	useStyle().setFontSize(e.target.value, part);
}
function fontFamilyChange(e, part) {
	console.log('fontFamilyChange', e.target.value, part);
	let fontname = useAssets().addFont(e.target.value);
	useStyle().setFont(fontname, part);
}
const infoObj = {
	sessionStorage: `sessionStorage persists in the browser only when refreshing the website and is contained to this session. `,
	localStorage: `localStorage remains saved in the browser until removed. `,
	nextcloud: `Saves data and settings to your Nextcloud storage`,
};
function info(key) {
	let text = useStore().infoText[key];
	useStore().info(text);
}


const generatearray = (start, end, text = '') => Array.from({ length: end - start + 1 }, (_, i) => `${start + i}${text}`);

const clearLocalStorage = () => localStorage.clear();
const clearSessionStorage = () => sessionStorage.clear();

function togglePizzaSparkle() {
	let pizzasparkle = useStore().$state.pizzasparkle;
	if (!pizzasparkle) useStore().$state.pizzasparkle = new PizzaSparkle(pizzapng);
	else {
		if (useStore().$state.pizzasparkle.enabled) useStore().$state.pizzasparkle.disable();
		else if (!useStore().$state.pizzasparkle.enabled) useStore().$state.pizzasparkle.enable();
	}

}
function clearStorage(storage, key) {
	useStore().log('Settings.clearStorage', storage, key)
	if (key) {
		window[storage].removeItem(key);
		useStyle().postMessage(`${key}: ${storage} cleared`)
	}
}

function toggleLog(e) {
	if (!window.Console) return
	let checked = e.target.checked
	if (useConfig().settings.useConsole) Console.enable()
	else Console.disable()
	save()
}
function save() {
	useConfig().save('general', useConfig().settings)
}
</script>

<template>
	<div class="wrapper" v-if="true" :ref="(el) => (refs.wrapper = el)">
		<div>
			<div style="height: 4ch; display:inline-block">
				<img @click="togglePizzaSparkle" :src="pizzapng" alt="pizza" class="clickable-img" style="height: 4ch" :style="[useStore().$state?.pizzasparkle?.enabled ? { 'background-color': 'green' } : {}]" />
			</div>
			<div :ref="(el) => (refs.chuck = el)" style="height: 4ch; display:inline-block"></div>
			<div style="height: 4ch; display:inline-block">
				<pizza-power></pizza-power>
			</div>
			<input type="checkbox" @change="save" v-model="useConfig().settings.debug" :title="'debug/extra stuff'" />
		</div>
		<div v-if="useConfig().settings.debug" style="border: 1px solid red; display:flex;flex-direction: column;">
			<label>
				<input type="checkbox" @change="toggleLog" v-model="useConfig().settings.disableConsole" :title="'Disable normal console.log(). \nDoesnt effect iframes console.log(). \nRequires reloading the page.'" />
				Disable normal console
			</label>
			<label>
				<input type="checkbox" @change="toggleLog" v-model="useConfig().settings.useConsole" :title="((useConfig().settings.useConsole) ? 'Disable' : 'Enable') + ' log. \nMight interfer with codesandbox console.log() if enabled. '" />
				Console
			</label>
			<button style="display:block;" @click="clearLocalStorage">localStorage.clear()</button>
			<button style="display:block;" @click="clearSessionStorage">sessionStorage.clear()</button>
		</div>
		<table class="table-storage">
			<tr>
				<th>Module</th>
				<th :title="useStore().infoText.sessionStorage">
					<SvgQuestionMark @click="info('sessionStorage')" :title="infoObj['sessionStorage']" />sessionStorage
				</th>
				<th :title="useStore().infoText.localStorage">
					<SvgQuestionMark @click="info('localStorage')" :title="infoObj['localStorage']" />localStorage
				</th>
				<th :title="useStore().infoText.nextcloud">
					<SvgQuestionMark @click="info('nextcloud')" :title="infoObj['nextcloud']" />NextCloud
				</th>
			</tr>
			<tr v-for="(value, key) in useConfig().storage">
				<td>{{ capitalize(key) }}</td>
				<td v-for="(val, i) in ['sessionStorage', 'localStorage', 'nextcloud']">
					<template v-if="useConfig().storage[key][val] != undefined">
						<span>
							<ImageBox :src="useAssets().assets.icons['bin-svgrepo-com.svg']" :inverted="true" v-if="val != 'nextcloud'" @click="clearStorage(val, key)" :title="'Clear ' + val" />
							<input type="checkbox" v-model="useConfig().storage[key][val]" :title="val + ' - ' + useConfig().storage[key][val]" @change="storageCheckboxChange($event, key, val, useConfig().storage[key])" :disabled="(key == 'nextcloud' || val == 'nextcloud') && (!useNextCloud().nextcloud.user || !useNextCloud().nextcloud.token || !useNextCloud().nextcloud.domain)" />
						</span>
					</template>
				</td>
			</tr>
		</table>
		<table class="table-style">
			<tr>
				<th></th>
				<th>Font size</th>
				<th>Font family</th>
			</tr>
			<tr v-for="(value, key) in useStyle().styles">
				<td>{{ capitalize(key) }}</td>
				<td>
					<select v-model="useStyle().styles[key].fontSize" @change="fontSizeChange($event, key)" v-if="useStyle().styles[key]?.fontSize">
						<template v-for="(value, i) in generatearray(5, 25, 'px')">
							<option :value="value">{{ value }}</option>
						</template>
					</select>
				</td>
				<td>
					<select v-model="useStyle().styles[key].fontFamily" @change="fontFamilyChange($event, key)" v-if="useStyle().styles[key]?.fontFamily">
						<template v-for="(value, key) in useAssets().assets.fonts">
							<option :value="key">{{ key }}</option>
						</template>
					</select>
				</td>
			</tr>
			<tr>
				<td>Shade</td>
				<td colspan="2">
					<input type="range" v-model="useConfig().settings.shadeOpacity" min="0" max="100" style="width:100%;" />
				</td>
			</tr>
		</table>
	</div>
</template>

<style scoped lang="scss">
.table-storage {
	border-collapse: collapse;
	background-color: rgb(45, 45, 45);
}

.table-storage th {
	font-size: 1ch;
}

.table-storage th,
td {
	border: 1px dotted chocolate;
	align-items: center;
	text-align: center;
	white-space: nowrap;
	padding: 0 5px;
}

.wrapper {
	display: flex;
	flex-direction: column;
	background-color: rgba(41, 41, 41, 0.4);
	border-radius: 5px;
	width: fit-content;
	height: fit-content;
	align-items: baseline;
}
</style>
