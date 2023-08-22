<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, reactive } from 'vue';
import { useStore, useNextCloud, useConfig, useStyle, useAssets, } from '@stores/store.js';
//import {useStore, useNextCloud, useConfig} from '@stores/store.js';
//import {SvgBin} from './SvgIcons.vue';
const refs = reactive({});
const state = reactive({
	data: {
		logObject: { show: false },
		countdowns: { show: false },
		stopwatches: { show: false },
		pizzasbounce: { show: false },
	},
	show: false,
});
const props = defineProps({});

onMounted(() => { });


</script>

<template>
	<div class="container">
		<div class="row">
			<button onclick="console.log(localStorage);console.log(Object.entries(localStorage).reduce((a,[k,v])=>({...a, [k]:v.length}),{}))" value="console.log">localStorage</button>
			<button onclick="console.log(sessionStorage);console.log(Object.entries(sessionStorage).reduce((a,[k,v])=>({...a, [k]:v.length}),{}))" value="console.log">sessionStorage</button>
		</div>
		<div class="row">
			<button v-for="(value, key) in state.data" @click="(state.show == key) ? state.show = false : state.show = key" :style="[state.show == 'key' ? { backgroundColor: 'green' } : {}]">{{ key }}</button>
		</div>
		<textarea v-if="state.show" :value="JSON.stringify(useStore()[state.show], null, 2)" spellcheck="false" />

		<template v-for="(value, key) in state.data">
			<button @click="state.data[key].show = !state.data[key].show" style="background-color: gray;">{{ key }}</button>
			<template v-if="state.data[key].show">
				<template v-if="typeof value == 'object'" v-for="(subvalue, subkey) in useStore()[key]">
					<button @click="(state.data[key][subvalue]) ? state.data[key][subvalue] = false : state.data[key][subvalue] = true">{{ subkey }}</button>
					<textarea v-if="state.data[key][subvalue]" :value="JSON.stringify(subvalue, null, 2)" spellcheck="false" />
				</template>
				<textarea v-else :value="JSON.stringify(useStore()[key], null, 2)" spellcheck="false" />
			</template>


		</template>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.row {
	display: flex;
	flex-direction: row;
}

textarea {
	width: 100%;
	height: 100%;
}
</style>
