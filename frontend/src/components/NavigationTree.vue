<script setup>
import { onMounted, reactive } from 'vue';
import NavigationTree from './NavigationTree.vue';
//import pizzapng from '@assets/pizza/icon32.png';
const refs = reactive({});
const state = reactive({});
const props = defineProps({
	path: { default: [] },
	obj: { default: {} },
});
//const paddingLeft = computed(()=>{})
const style = computed(() => {
	let paddingLeft = props.path.length * 1
	return {
		'padding-left': `${paddingLeft}ch`,
	}
})
onMounted(() => {
	console.log('NavigationTree', props.path, props.obj)
});

function typeOfRow(value, key) {
	if ((typeof value == 'object' && value.__file && value.__file.includes('.vue'))) return 'component-row'
	else return 'submenu-row'
}

</script>

<template>
	<div class="navigation-row" v-for="(value, key) in props.obj" :class="typeOfRow(value, key)" :title="typeOfRow(value, key)">
		<details v-if="(typeof value == 'object' && value.__file && (value.__file.includes('.vue')) || key.includes('.vue'))" :style="style">
			<summary class="component-summary">{{ key }}</summary>
			<span class="component-container">
				<component :is="value"  />
			</span>
		</details>

		<details v-else-if="typeof value == 'object'" :style="style" open>
			<summary class="submenu-summary">{{ key }}</summary>
			<NavigationTree :path="[...props.path, key]" :obj="value" /> 
		</details>

	</div>
</template>

<style scoped lang="scss">
* {
	box-sizing: border-box;
	margin: 0;
	background-color: '';
}

.navigation-container {
	display: flex;
	flex-direction: column;
}

.navigation-row {
	details {

		.submenu-summary {
			background-color: black;
			border: 1px solid rgb(0, 72, 255);
		}

		.component-summary {
			background-color: black;
			//border: 1px solid red;
			color: green;
		}

		.component {
			padding: 0 0 0 0; //  0 0 1ch 0;
		}
	}

	summary {
		cursor: pointer;
		width: fit-content;
		padding: 0 1ch;
		border-radius: 0.5ch;

	}



}
</style>
