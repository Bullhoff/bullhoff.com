<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useStore, useNextCloud, useConfig } from './../stores/store.js';
import { onMounted, reactive, nextTick } from 'vue';
import { SvgQuestionMark } from './SvgIcons.vue';

//import {poller} from './nextcloud/nextcloud.js';

const refs = reactive({});
const state = reactive({
	info: false
});
const props = defineProps({});

onMounted(() => { });

function checkboxChangeSettings(e) {
	let [id, checked] = [e.target.id, e.target.checked];
	useConfig().storage.nextcloud[id] = checked;
	useNextCloud().saveConfig();
}
function onChange() {
	useNextCloud().saveConfig();
}
function info(key) {
	useStore().info(infoObj[key])
}
const infoObj = {
	domain: `Domain. \nEnter the base url to the domain where your nextcloud is. `,
	folder: `Specify the folder that this website saves settings to. \nExample: /data/frombullhoff.com/`,
	sessionStorage: `Saves the username and login token to sessionStorage. \n${useStore().infoText.sessionStorage}`,
	localStorage: `Saves the username and login token to localStorage. \n${useStore().infoText.localStorage}`,
};

</script>

<template>
	<dialog :open="state.info" style="background-color: chocolate; color:white;">
		<p>
			{{ infoObj[state.info] }}
		</p>
		<form method="dialog">
			<button @click="state.info = false">OK</button>
		</form>
	</dialog>

	<div class="container">
		<div>
			<button style="color:red;" @click="useStore().info(`Theres currently not any safeguard against accidentally overwriting the saved files. \nExample: If you have the website open on two computers, using it on one and then start using it on the other pc without first refreshing it will overwrite anything that got saved from the first pc. `)">&#x26A0;</button>
		</div>
		<div class="row-input-button" :title="useNextCloud().validLogin + '\n' + JSON.stringify(useNextCloud().nextcloud, null, 2)">
			<button @click="useNextCloud().login()" v-if="!useNextCloud().validLogin">Login</button>
			<button @click="useNextCloud().logout()" v-else>Logout</button>
			{{ useNextCloud().nextcloud.user }}
		</div>
		<div class="row-text-input">
			<label for="domain"> Domain: </label>
			<input id="domain" v-model="useNextCloud().nextcloud.domain" @change="onChange" />
			<SvgQuestionMark @click="info('domain')" :title="infoObj['domain']" />
		</div>
		<div class="row-text-input">
			<label for="folder"> Save to folder: </label>
			<input id="folder" type="text" v-model="useNextCloud().nextcloud.folder" @change="onChange" />
			<SvgQuestionMark @click="info(`folder`)" :title="infoObj['folder']" />
		</div>

		<div class="row-checkbox">
			<input id="sessionStorage" type="checkbox" :checked="useConfig().storage.nextcloud.sessionStorage" @change="checkboxChangeSettings($event, 'sessionStorage')" />
			<label for="sessionStorage"> saveLoginTokenToSessionStorage </label>
			<SvgQuestionMark @click="info('sessionStorage')" :title="infoObj['sessionStorage']" />
		</div>
		<div class="row-checkbox">
			<input id="localStorage" type="checkbox" :checked="useConfig().storage.nextcloud.localStorage" @change="checkboxChangeSettings($event, 'localStorage')" />
			<label for="localStorage"> saveLoginTokenToLocalStorage </label>
			<SvgQuestionMark @click="info('localStorage')" :title="infoObj['localStorage']" />
		</div>
	</div>
</template>

<style scoped>
label {
	white-space: nowrap;
}

input {
	height: fit-content;
	align-self: center;
}

.container {
	width: fit-content;
	padding: 3px;
	align-items: center;
	align-content: center;
}

.container>div {
	gap: 10px 10px;
}

.row-input-button {
	display: grid;
	grid-template-columns: fit-content(3ch) 1fr;
	height: 100%;
	align-items: center;
}

.row-checkbox {
	display: grid;
	grid-template-columns: fit-content(3ch) 1fr fit-content(3ch);
	gap: 10px 30px;
}

.row-text-input {
	display: grid;
	grid-template-columns: 1fr 1fr fit-content(3ch);
	gap: 10px 30px;
	width: fit-content;
}</style>
