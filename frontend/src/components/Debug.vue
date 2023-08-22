<script setup>
import {RouterLink, RouterView} from 'vue-router';
import {useStore, useNextCloud, useConfig} from '@stores/store.js';
import {onMounted, reactive} from 'vue';
import {SvgBin} from './SvgIcons.vue'
const refs = reactive({wrapper: null});
onMounted(() => {
});

const clearLocalStorage = () => localStorage.clear()
const clearSessionStorage = () => sessionStorage.clear()

function logwindow(cmd, p=window) {
    let res = window[cmd]
	console.log(res)
}
function logimport() {
    console.log(import.meta)
	console.log(import.meta.env)
}
</script>

<template>
	<Teleport to="#extra-settings">
		
	</Teleport>
	<div class="wrapper" v-if="true" :ref="(el) => (refs.wrapper = el)">
		<button @click="logwindow('localStorage')">Console.log(localStorage)</button>
        <button @click="logwindow('sessionStorage')">Console.log(sessionStorage)</button>
        <button @click="logimport()">Console.log(import.meta)</button>
        <button @click="clearLocalStorage()">clearLocalStorage</button>
        <button @click="clearSessionStorage()">clearSessionStorage</button>
		<SvgBin />
		<Checkbox />
		<Checkbox />
		<Checkbox />
	</div>
</template>

<style scoped>
.wrapper {
    display:flex;
    flex-direction: column;
	background-color: rgba(41, 41, 41, 0.4);
	border-radius: 5px;
	width: fit-content;
	height: fit-content;
	align-items: baseline;
}
</style>
