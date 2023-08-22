<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, reactive, useSlots } from 'vue';
import pizzapng from '@assets/pizza/icon32.png';
//import {useStore, useNextCloud, useConfig} from '@stores/store.js';
//import {SvgBin} from './SvgIcons.vue';
const slots = useSlots()
const refs = reactive({ btnContainer: null });
const state = reactive({});
const emit = defineEmits(['click'])
const props = defineProps({
	active: { default: '' },
});

//watch(() => props.value,(newValue, oldValue) => {},{immediate: true});
//watch(state,(newValue, oldValue) => {console.log(`watch`, {...oldValue}, {...newValue});},{deep: true, immediate: true});
//watch(inputValueRo, (value) => {});
onBeforeMount(() => {
	//console.log('ButtonGroup', 1, props.active, 'onMounted', slots?.default())
	if(!slots?.default) return
	let sl = slots?.default()
	if(sl)
	for (let i = 0; i < sl.length; i++) {
		if (props.active == sl[i].children) sl[i].props.class += ' group-btn-active'
		else if (Array.isArray(sl[i].children)) {
			if (props.active === sl[i].children?.children) {
				if (!sl[i].children.props) sl[i].children.props = { class: null }
				sl[i].children.props.class = (sl[i].children.props.class) ? sl[i].children.props.class + ' group-btn-active' : 'group-btn-active'
				console.log('!!!!!!!!!!!!slots.el.Array.isArray', props.active, sl[i].children.children, sl[i].children)
			}
		}
	}
	return 
	slots.default().forEach(el => {
		console.log('slots.default().forEach', el, el.children)
		if (props.active == el.children) el.props.class += ' group-btn-active'
		else if (Array.isArray(el.children)) {
			el.children.forEach((elchild) => {
				console.log('slots.el.Array.isArray1', props.active, elchild.children, elchild.props.class, ({ ...elchild }))
				if (props.active === elchild?.children) {
					if (!elchild.props) elchild.props = { class: null }
					elchild.props.class = (elchild.props.class) ? elchild.props.class + ' group-btn-active' : 'group-btn-active'
					console.log('!!!!!!!!!!!!slots.el.Array.isArray', props.active, elchild.children, elchild)
				}
				console.log('slots.el.Array.isArray2', props.active, elchild.children, elchild.props.class, ({ ...elchild }))
			})
		}
	});
	console.log('ButtonGroup', 2, props.active, 'onMounted', slots.default())
})
onMounted(() => { });



watch(() => props.active, (newValue, oldValue) => {
	//return 
	//console.log('watch', props.active, `"${newValue}" - "${oldValue}" \t\t`, newValue, oldValue, refs.btnContainer)

	if (!refs.btnContainer) var interval = setInterval(()=>{
		if(refs.btnContainer) {
			interval = clearInterval(interval)
			return toggle(newValue, oldValue)
		}

	},100)
	toggle(newValue, oldValue)

}, { immediate: true });

function toggle(newValue, oldValue){
	if(!refs.btnContainer ) return
	let btns = refs.btnContainer.querySelectorAll('button')
	//console.log('btns', btns)
	btns.forEach((el) => {
		if (el.innerText == oldValue) el.classList.remove('group-btn-active')
		else if (el.innerText == newValue) el.classList.add('group-btn-active')
	})
}

function onClick(e) {
	emit('click', e)
}

</script>

<template>
	<div class="btn-group-container-frame">
		<div class="btn-group-container" :ref="(el) => refs.btnContainer = el">
			<div class="btn-container">
				<slot name="button"></slot>
			</div>
			<div class="btn-container" @click="onClick">
				<slot />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
* {
	box-sizing: border-box;
	margin: 0;
}

.btn-group-container-frame {
	align-self: stretch;
	max-height: 100%;
	display: inline-flex;
	flex-direction: row;
	border: 1px solid rgb(0, 205, 160);
	border-radius: 1ch;
	padding: 0 0.5ch;
	overflow: hidden;
	border-collapse: collapse;
	background-color: rgb(0, 0, 0);
}

.btn-group-container {
	display: flex;
	flex-direction: row;
	overflow: hidden;
	border-radius: 0.5ch;

	border-collapse: collapse;
}

.btn-container {
	display: contents;
}



.btn-container button {
	box-sizing: border-box;
	padding: 0 0.4ch;
	border-radius: 0;
	border: none;
	border-collapse: collapse;
	color: aqua;

	&:hover {
		//background-color: rgba(225, 255, 0, 1);
		//color: rgba(0, 0, 0, 0.7);
		color: rgb(234, 255, 0);
	}
}

.btn-container>button+button {
	border-left: 1px solid rgb(62, 62, 62);
}

.btn-container .group-btn-active {
	background-color: rgb(98, 255, 0);
	color: rgb(0, 0, 0);
	box-shadow: inset 1px 1px 1px 1px rgb(0, 0, 0);
	//box-shadow: 1ch;
	//border: 1px solid rgb(0, 0, 0);
}
</style>
