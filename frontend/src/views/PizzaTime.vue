<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useStore, useConfig } from './../stores/store.js';
import { onMounted, reactive } from 'vue';
import { PizzaTime } from '@scripts/pizzatime.js';
//import URL from '@scripts/url.js'
const refs = reactive({ wrapper: null });

let pizza = ref(null)


onMounted(() => {
	useStore().isReady('pizzatime', init);
});
function init() {
	pizza.value = new PizzaTime({ parent: refs.wrapper, ...useStore().pizzatime, onChange });
}
function onChange(obj) {
	if(obj) useConfig().save('pizzatime', JSON.stringify(obj))
} 
</script>

<template>
	<Teleport to="#extra-settings" v-if="pizza">
		<tr>
			<td>Fullscreen</td>
			<td><button @click="pizza.requestFullscreen()">&#x2921;</button></td>
			<!-- U+26F6, U+2725, U+2921, U+2922 -->
		</tr>
		<tr>
			<td colspan="2">updateFrequency</td>
			<td v-if="pizza?.updateFrequency"><input type="number" min="0" :value="pizza.updateFrequency" @change="pizza.changeFrequency($event.target.value)" /></td>
			<td><button @click="pizza.resetValue(null, 'frequency')">&#x21BA;</button></td>
		</tr>
		<tr>
			<td>Hours</td>
			<td><input type="checkbox" :checked="pizza.visibility.h" @change="pizza.changeVisibility('h', $event.target.checked)" /></td>
			<td><input type="number" min="0" :value="Math.round(pizza.scale.h * 100)" @change="pizza.changeSize('h', $event.target.value / 100)" /></td>
			<td><button @click="pizza.resetValue('h', 'scale')">&#x21BA;</button></td>
		</tr>
		<tr>
			<td>Minutes</td>
			<td><input type="checkbox" :checked="pizza.visibility.m" @change="pizza.changeVisibility('m', $event.target.checked)" /></td>
			<td><input type="number" min="0" :value="Math.round(pizza.scale.m * 100)" @change="pizza.changeSize('m', $event.target.value / 100)" /></td>
			<td><button @click="pizza.resetValue('m', 'scale')">&#x21BA;</button></td>
		</tr>
		<tr>
			<td>Seconds</td>
			<td><input type="checkbox" :checked="pizza.visibility.s" @change="pizza.changeVisibility('s', $event.target.checked)" /></td>
			<td><input type="number" min="0" :value="Math.round(pizza.scale.s * 100)" @change="pizza.changeSize('s', $event.target.value / 100)" /></td>
			<td><button @click="pizza.resetValue('s', 'scale')">&#x21BA;</button></td>
		</tr>
		<tr>
			<td>Milliseconds</td>
			<td><input type="checkbox" :checked="pizza.visibility.ms" @change="pizza.changeVisibility('ms', $event.target.checked)" /></td>
			<td><input type="number" min="0" :value="Math.round(pizza.scale.ms * 100)" @change="pizza.changeSize('ms', $event.target.value / 100)" /></td>
			<td><button @click="pizza.resetValue('ms', 'scale')">&#x21BA;</button></td>
		</tr>
	</Teleport>
	<div class="wrapper" v-if="true" :ref="(el) => (refs.wrapper = el)"></div>
</template>

<style scoped>

.wrapper {
	object-fit: contain;
	display: flex;
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>
