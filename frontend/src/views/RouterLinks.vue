<template>
	<!-- <div class="header-left"> -->
	<RouterLink class="button" to="/">Home</RouterLink>

	<RouterLink class="button" to="/stopwatch">Stopwatch</RouterLink>
	<RouterLink class="button" to="/countdown">Countdown</RouterLink>
	<RouterLink class="button" to="/fixtext">Fix text</RouterLink>
	<RouterLink class="button" to="/codesandbox">Code sandbox</RouterLink>
	<RouterLink class="button" to="/imagetotext">Image to text</RouterLink>

	<RouterLink class="button" to="/pizzaspin">Pizzaspin</RouterLink>
	<RouterLink class="button" to="/pizzabounce">Pizzabounce</RouterLink>
	<RouterLink class="button" to="/pizzatime">Pizzatime</RouterLink>
	<!-- </div> -->
</template>

<script setup>
import { useStore, useNextCloud, useConfig, useStyle, useAssets } from '@stores/store.js';
import { onMounted, reactive } from 'vue';
import { capitalize } from '@scripts/scripts.js';
import { SvgNextCloudWhite, SvgNextCloudBlue, SvgBicycle, SvgDebug } from '@components/SvgIcons.vue';
import { PizzaTime } from '@scripts/pizzatime.js';

onMounted(() => {
	//new PizzaTime({parent: document.getElementById('header-left')});
});
</script>

<style scoped></style>
