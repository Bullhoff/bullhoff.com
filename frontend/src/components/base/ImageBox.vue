<script setup>
import { shallowRef, shallowReactive, onMounted, reactive } from 'vue';
import pizzapng from '@assets/pizza/icon32.png';
const refs = reactive({});
const containerRef = ref(null);
const imageRef = ref(null);
const state = shallowReactive({
	hover: false,
	active: false,
});
const slots = useSlots()
//const attrs = useAttrs()

const emit = defineEmits(['onClick', 'onPointerdown', 'onPointerup']);
const props = defineProps({
	debug: {
		type: Boolean,
		required: false,
		default: false,
	},
	title: {
		type: [String, Object, Number, Boolean],
		required: false,
		default: '',
	},
	active: {
		type: Boolean,
		required: false,
		default: false,
	},
	src: {
		type: [String],
		required: false,
		default: pizzapng,
	},
	class: {
		type: [Array, String],
		required: false,
		default: [],
	},
	style: {
		type: [Object, Array],
		required: false,
		default: {},
	},
	imgStyle: {
		type: [Object, Array],
		required: false,
		default: {},
	},
	hoverStyle: {
		type: [Object, Array],
		required: false,
		default: {},
	},
	activeStyle: {
		type: [Object, Array],
		required: false,
		default: {},
	},

	preventSelect: {
		type: Boolean,
		required: false,
		default: true,
	},
	inverted: {
		type: Boolean,
		required: false,
		default: false,
	},
	adjustHeightToLine: {
		type: Boolean,
		required: false,
		default: true,
	}
});
const adjustedSize = reactive({});
// '#' + (Math.floor(Math.random()*16777214) + 1).toString(16).padStart(6, '0')
function log() {
	console.log(`%c*ImageBox*`, `color:#AAFF00`, ...arguments);
}
onMounted(() => {
	if (slots.default) {
		let svgs = containerRef.value.querySelectorAll('svg')
		svgs.forEach(el => {
			el.setAttribute('width', '90%')
			el.setAttribute('height', '90%')
			Object.assign(el.style, imgStyle.value)
		})
		let imgs = containerRef.value.querySelectorAll('img')
		imgs.forEach(el => {
			Object.assign(el.style, imgStyle.value)
		});

	}
	if (props.adjustHeightToLine) adjustedSize.height = getHeight() + 'px'
});
function getHeight() {
	let lineHeight = getComputedStyle(containerRef.value).getPropertyValue('line-height')
	lineHeight = parseFloat(lineHeight).toString()
	return lineHeight
}

let defaultStyles = {
	style: {
		display: 'inline-flex',
		position: 'relative',
		height: '100%',
		//height: '1em',
		cursor: 'pointer',
		border: '1px dotted gray',
		borderRadius: '0.5ch',
		//alignItems: 'center',
		width: 'fit-content',
		'align-items': 'stretch',
		'align-self': 'center',
	},
	imgStyle: {
		height: '90%',
		'align-self': 'center',
		position: 'relative',
		'object-fit': 'contain',
		'object-position': '50% 50%',
		'vertical-align': 'middle',
	},
	hoverStyle: {
		backgroundColor: 'yellow',
	},
	activeStyle: {
		backgroundColor: 'green',
	},
};

var updateCount = 0;
const debugObj = {
	updates: 0,
	click: 0,
	pointerdown: 0,
	pointerup: 0,
};

function getTitle() {
	let str = ``;
	let type = typeof props.title;
	if (props.debug) str += JSON.stringify(debugObj, null, 2) + `\n`; // debugObj.updates
	if (type == 'object') str += JSON.stringify(props.title, null, 2);
	else str += props.title;
	return str;
}

const style = computed(() => {

	return mergeStyles(props.style, [defaultStyles.style, adjustedSize])
});
const imgStyle = computed(() => mergeStyles(props.style, defaultStyles.imgStyle));
const hoverStyle = computed(() => mergeStyles(props.style, defaultStyles.hoverStyle));
const activeStyle = computed(() => mergeStyles(props.style, defaultStyles.activeStyle));

function mergeStyles(obj, defaultObj = {}, resObj = {}) {
	let resStyle = {};
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			Object.assign(resStyle, obj[i]);
		}
	} else {
		Object.assign(resStyle, obj);
	}

	if (Array.isArray(defaultObj)) {
		Object.assign(resObj, defaultObj[0], resStyle);
		if (defaultObj.length > 1)
			for (let i = 1; i < defaultObj.length; i++) {
				Object.assign(resObj, defaultObj[i]);
			}
	} else Object.assign(resObj, defaultObj, resStyle);
	debugObj.updates += 1;
	return resObj;
}


function onClick(e) {
	debugObj.click++;
	emit('onClick', e);
}
function pointerdown(e) {
	debugObj.pointerdown++;
	emit('onPointerdown', e);
}
function pointerup(e) {
	debugObj.pointerup++;
	emit('onPointerup', e);
}
onMounted(() => { });
</script>

<template>
	<!-- @pointerdown="pointerdown" @pointerup="pointerup" -->

	<div ref="containerRef" :class="(typeof props.class == 'string') ? props.class : props.class.join(' ')" :title="getTitle()" :style="[style, props.active ? activeStyle : state.hover ? hoverStyle : {}]" @mouseenter="state.hover = true" @mouseleave="state.hover = false" draggable="false" @pointerdown="pointerdown" @pointerup="pointerup" @click="onClick">
		<template v-if="Object.keys($slots).length > 0">
			<slot />
		</template>
		<img v-else ref="imageRef" :src="props.src" alt="" :style="imgStyle" draggable="false" :class="[props.inverted ? 'inverted' : '', props.preventSelect ? 'prevent-select' : '']" />
	</div>
</template>

<style scoped lang="scss">
.inverted {
	-webkit-filter: invert(1);
	filter: invert(1);
}

.prevent-select {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
</style>
