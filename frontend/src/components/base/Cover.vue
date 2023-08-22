<script setup>
import {RouterLink, RouterView} from 'vue-router';
import {onMounted, reactive, defineExpose} from 'vue';
//import {useStore, useNextCloud, useConfig} from '@stores/store.js';
//import {SvgBin} from './SvgIcons.vue';
//const refs = reactive({});
const coverRef = ref(null)
const state = reactive({
	show:false,
});
const props = defineProps({
	//ref: {default:null}
});

//watch(() => props.value,(newValue, oldValue) => {},{immediate: true});

onMounted(() => {});


const show = () =>{
	document.body.classList.toggle("prevent-select");
	state.show = true
	//element.classList.toggle("mystyle");
}
const hide = () =>{
	document.body.classList.toggle("prevent-select");
	state.show = false
}

defineExpose({ show, hide, });


</script>

<template>
	<!-- v-if="state.show"  -->
	<!-- @click.stop.prevent="" @pointerdown.stop.prevent="" @pointerup.stop.prevent="" -->
	<div class="cover" ref="coverRef" :style="[(state.show)?{'z-index':'9999'}:{'z-index':'-999'}]" ></div>
</template>

<style >
.cover{
	/* display:none; */
	display:block;
	position:fixed;
	background-color: rgba(0,0,255,0.0);
	width:100vw;
	height:100vh;
	/* pointer-events: none; */
	/* z-index:-1; */
}
</style>
