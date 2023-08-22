<script setup>
import { onMounted, reactive } from 'vue';
import MovableElement from '@scripts/MovableElement.js'
const refs = reactive({ wrapper: null, movable: null, textarea: null });
const state = reactive({ textarea: 'text' });

const props = defineProps({});

var movableElement
onMounted(() => {});


</script>

<template>

	<div class="grid-input">
		<p>button</p>
		<p><input type="button" /></p>
		<p>checkbox</p>
		<p><input type="checkbox" /></p>

		<p>date</p>
		<p><input type="date" /></p>
		<p>datetime-local</p>
		<p><input type="datetime-local" /></p>
		<p>time</p>
		<p><input type="time" /></p>
		<p>week</p>
		<p><input type="week" /></p>
		<p>month</p>
		<p><input type="month" /></p>

		<p>color</p>
		<p><input type="color" /></p>
		<p>email</p>
		<p><input type="email" /></p>
		<p>file</p>
		<p><input type="file" /></p>
		<p>hidden</p>
		<p><input type="hidden" /></p>
		<p>image</p>
		<p><input type="image" alt="icon32" src="/pizza/icon32.png" /></p>

		<p>number</p>
		<p><input type="number" /></p>
		<p>password</p>
		<p><input type="password" /></p>
		<p>radio</p>
		<p><input type="radio" /></p>
		<p>range</p>
		<p><input type="range" /></p>
		<p>reset</p>
		<p><input type="reset" /></p>
		<p>search</p>
		<p><input type="search" /></p>
		<p>submit</p>
		<p><input type="submit" /></p>
		<p>tel</p>
		<p><input type="tel" /></p>
		<p>text</p>
		<p><input type="text" /></p>

		<p>url</p>
		<p><input type="url" /></p>
	</div>
</template>

<style scoped lang="scss">
* {
	box-sizing: border-box;
	margin: 0;
}

input {
	min-width: 5ch;
	border: 1px dotted rgba(75, 75, 75, 0.517);
}

.grid-input {
	display: grid;
	//grid-template-columns: repeat(2, fit-content(5ch));
	grid-template-columns: repeat(2, minmax(min-content, 50%));
	border-collapse: collapse;
	gap: 0px 1ch;
}

.grid-input>* {
	border: 1px solid rgba(255, 0, 0, 0.513);
	width: fit-content;
	max-width: 30ch;
}</style>
