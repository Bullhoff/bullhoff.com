<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useStore, useNextCloud, useConfig, useStyle, useAssets } from '@stores/store.js';
import { onMounted, reactive, nextTick } from 'vue';
import { generateGUID } from '@scripts/scripts.js';
import MovableElement from '@scripts/MovableElement.js'
import { SvgNextCloudWhite, SvgNextCloudBlue, SvgBicycle, SvgDebug, SvgPin, SvgGreenDot, SvgRedDot } from './SvgIcons.vue';
//import {log} from '@scripts/scripts.js'
const slots = useSlots()
const attrs = useAttrs()
const refs = reactive({ dropdown: null, dropdownContainer: null, button: null, head: null, body: null });
const state = reactive({
	holding: false,
	x: 0,
	y: 0,
	open: false,
	stayOpen: false,
	id: 'dropdown-' + generateGUID(),
	children: 0,
});
const props = defineProps({
	raw: { default: false },
	config: { default: { closeOnClick: false } },
	iconStyle: { default: { height: '1em', width: '1em' } },
	svg: { default: null },
	buttonSymbol: { default: null },
	head: { default: null },
	body: { default: null },
	buttonStyle: { default: {} },
	//foo?: string
});


function log() {
	if (window.Console) Console.log({ file: 'Dropdown.vue' }, ...arguments)
}


let observer = new ResizeObserver(function (mutations) {
	log('mutations', mutations);
	ensureBounderies();
});


function ttest() {
	if (slots.dropdown) {
		let elements = slots.dropdown()
		console.log('dropdown.onMounted1', elements)
		if (slots.dropdown) slots.dropdown().forEach((el) => {
			console.log('dropdown.onMounted2', { el, children: el.children })
		})
	}
}

onMounted(() => {
	//observer.observe(refs.dropdown);
	if (props.buttonSymbol != null && icons[props.buttonSymbol]) refs.button.innerHTML = icons[props.buttonSymbol]({ stroke: 'white' });

	if (!refs.dropdown) return
	state.children = refs.dropdown.querySelector('.dropdown').children.length;

	if (refs.head && refs.dropdown) {
		new MovableElement({ head: refs.head, body: refs.dropdown, })
	}

});


const toggleShow = () => {
	if (!refs.dropdown) return;
	if (state.open) {
		refs.dropdown.style.display = 'flex';
		window.addEventListener('click', clickListener);
		ensureBounderies();
		EventListeners(state.open);
	} else {
		refs.dropdown.style.display = 'none';
		window.removeEventListener('click', clickListener);
		EventListeners(state.open);
	}
};
const clickListener = (e) => {
	if (e.target.closest(`#${state.id}_button`) || state.stayOpen || e.target.closest(`#${state.id}_head`) || e.target.closest(`.cover`)) return
	if (e.target.id == state.id) return

	let isChild = e.target.closest(`#${state.id}`);
	if (isChild && props.config.closeOnClick) {
		state.open = false;
		toggleShow();
	}
	if (!isChild && !state.stayOpen && e.target.id != state.id) {
		state.open = false;
		toggleShow();
	} else if (e.target.classList.contains('router-link-active')) {
		console.log('e.target', e.target, e.target.classList.contains('router-link-active'), Array.from(e.target.classList).includes('router-link-active'));
		EventListeners(state.open);
	}
};
async function EventListeners(open) {
	await nextTick();
	let els = [/* ...document.getElementsByTagName("embed"), ...document.getElementsByTagName("object"), */ ...document.getElementsByTagName('iframe')];
	log('EventListeners', 'els', els);
	for (let i = 0; i < els.length; i++) {
		if (open) els[i].contentWindow.document.addEventListener('click', clickListener);
		else els[i].contentWindow.document.addEventListener('click', clickListener);
	}
}
function onClick() {
	state.open = !state.open;
	toggleShow();
}
function ensureBounderies() {
	if (!refs.dropdown) return;
	let rect = refs.dropdown.getBoundingClientRect();
	let margin = 5;
	if (rect.right - margin > window.innerWidth) refs.dropdown.style.left = `${Math.round(window.innerWidth - rect.width - margin)}px`;
	//if (rect.bottom-margin > window.innerHeight) refs.dropdown.style.bottom = `${Math.round(window.innerHeight - rect.height - margin)}px`;
	//if (rect.right > window.innerWidth) refs.dropdown.style.right = `${window.innerWidth - 5}px`;
	//if (rect.bottom > window.innerHeight) refs.dropdown.style.bottom = `${window.innerHeight - 5}px`;
	if (rect.left < 0 + margin) refs.dropdown.style.left = `${0 + margin}px`;
	if (rect.top < 0 + margin) refs.dropdown.style.top = `${0 + margin}px`;
}

function onFocus(e) {
	//let els = document.body.getElementsByClassName('dropdown-wrapper')
	let els = document.body.querySelectorAll('.dropdown-wrapper')
	log('onFocus', refs.dropdown.style, els)
	if (els) els.forEach((el) => {
		el.style.zIndex = 8888
	})

	refs.dropdown.style.zIndex = 9999

}

defineExpose({ onClick })

const icons = {
	//icon: ({fill='none', stroke='#000000'}={})=>(``),

	// https://www.svgrepo.com/svg/306464/nextcloud
	nextcloud: ({ fill = 'none', stroke = '#000000', style = {} } = {}) => `
	<svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet" fill="${stroke}" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
		<title>Nextcloud icon</title>
		<path d="M12.018 6.537c-2.5 0-4.6 1.712-5.241 4.015-.56-1.232-1.793-2.105-3.225-2.105A3.569 3.569 0 0 0 0 12a3.569 3.569 0 0 0 3.552 3.553c1.432 0 2.664-.874 3.224-2.106.641 2.304 2.742 4.016 5.242 4.016 2.487 0 4.576-1.693 5.231-3.977.569 1.21 1.783 2.067 3.198 2.067A3.568 3.568 0 0 0 24 12a3.569 3.569 0 0 0-3.553-3.553c-1.416 0-2.63.858-3.199 2.067-.654-2.284-2.743-3.978-5.23-3.977zm0 2.085c1.878 0 3.378 1.5 3.378 3.378 0 1.878-1.5 3.378-3.378 3.378A3.362 3.362 0 0 1 8.641 12c0-1.878 1.5-3.378 3.377-3.378zm-8.466 1.91c.822 0 1.467.645 1.467 1.468s-.644 1.467-1.467 1.468A1.452 1.452 0 0 1 2.085 12c0-.823.644-1.467 1.467-1.467zm16.895 0c.823 0 1.468.645 1.468 1.468s-.645 1.468-1.468 1.468A1.452 1.452 0 0 1 18.98 12c0-.823.644-1.467 1.467-1.467z"/>
	</svg>`,

	// https://www.svgrepo.com/svg/442028/alarm
	alarm: ({ fill = 'none', stroke = '#000000' } = {}) => `
	<svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="${fill}">
		<circle cx="16" cy="17" r="11" stroke="${stroke}" stroke-width="2"/>
		<path fill="${stroke}" d="M25.9 7.1a1 1 0 101.414-1.415L25.899 7.1zM20.14 1.543a1 1 0 10-.517 1.932l.517-1.932zm7.173 4.141a16 16 0 00-7.173-4.14l-.517 1.93A14 14 0 0125.9 7.1l1.414-1.414zM12.377 3.476a1 1 0 10-.518-1.932l.518 1.932zm-7.69 2.21A1 1 0 106.1 7.098L4.686 5.685zm7.172-4.142a16 16 0 00-7.173 4.141L6.101 7.1a14 14 0 016.276-3.623l-.518-1.932z"/>
		<path stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 10.5V17l-4 4"/>
	</svg>`,

	// https://www.svgrepo.com/svg/491204/clock
	clock: ({ fill = 'none', stroke = '#000000' } = {}) => `
	<svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet"  viewBox="0 0 24 24"  fill="${fill}" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="12" r="8" stroke="${stroke}" stroke-width="2"/>
		<path d="M13 7.5L12.5436 11.6079C12.5156 11.8599 12.3929 12.0918 12.2005 12.2567L9 15" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
	</svg>`,

	// https://www.svgrepo.com/svg/491221/doner
	döner: ({ fill = 'none', stroke = '#000000' } = {}) => `
	<svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg">
		<path d="M5 7H19" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M7 12L17 12" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M9 17L15 17" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>`,

	// https://www.svgrepo.com/svg/491263/kebab
	kebab: ({ fill = 'none', stroke = '#000000' } = {}) => `
	<svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="6" r="2" transform="rotate(90 12 6)" fill="${stroke}"/>
		<circle cx="12" cy="12" r="2" transform="rotate(90 12 12)" fill="${stroke}"/>
		<path d="M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" fill="${stroke}"/>
	</svg>`,

	// https://www.svgrepo.com/svg/441976/meatballs-h
	meatballs: ({ fill = 'none', stroke = '#000000' } = {}) => `
	<svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="${fill}">
  		<path fill="${stroke}" d="M8 18a2 2 0 100-4 2 2 0 000 4zM16 18a2 2 0 100-4 2 2 0 000 4zM24 18a2 2 0 100-4 2 2 0 000 4z"/>
	</svg>`,

	// https://www.svgrepo.com/svg/491191/burger-simple
	hamburger2: ({ fill = 'none', stroke = '#000000' } = {}) => `
	<svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg">
		<path d="M5 12H20" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
		<path d="M5 17H20" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
		<path d="M5 7H20" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
	</svg>`,

	// https://www.svgrepo.com/svg/491244/hamburger
	hamburger: ({ fill = 'none', stroke = '#000000' } = {}) => `
	<svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg">
		<path d="M5 7H19" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M5 12L19 12" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M5 17L19 17" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>`,
	// https://www.svgrepo.com/svg/491186/bento
	bento: ({ fill = 'none', stroke = '#000000' } = {}) => `
    <svg height="${useStyle().topmenuHeight}" width="100%" preserveAspectRatio="xMinYMid meet" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
        <rect x="3" y="9.42859" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
        <rect x="3" y="15.8571" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
        <rect x="9.42871" y="3" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
        <rect x="15.8572" y="3" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
        <rect x="9.42871" y="9.42859" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
        <rect x="9.42871" y="15.8571" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
        <rect x="15.8572" y="9.42859" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
        <rect x="15.8572" y="15.8571" width="5.14286" height="5.14286" rx="1.28571" fill="${stroke}"/>
    </svg>`,
	// https://www.svgrepo.com/svg/509221/settings
	settings: ({ fill = 'none', stroke = '#000000' } = {}) => `
    <svg fill="${stroke}" height="${useStyle().topmenuHeight}" width="100%"  preserveAspectRatio="xMinYMid meet" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M30.015 12.97l-2.567-0.569c-0.2-0.64-0.462-1.252-0.762-1.841l1.389-2.313c0.518-0.829 0.78-2.047 0-2.829l-1.415-1.414c-0.78-0.781-2.098-0.64-2.894-0.088l-2.251 1.434c-0.584-0.303-1.195-0.563-1.829-0.768l-0.576-2.598c-0.172-0.953-1.005-1.984-2.11-1.984h-2c-1.104 0-1.781 1.047-2 2l-0.642 2.567c-0.678 0.216-1.328 0.492-1.948 0.819l-2.308-1.47c-0.795-0.552-2.114-0.692-2.894 0.088l-1.415 1.414c-0.781 0.782-0.519 2 0 2.828l1.461 2.435c-0.274 0.552-0.517 1.123-0.705 1.72l-2.566 0.569c-0.953 0.171-1.984 1.005-1.984 2.109v2c0 1.105 1.047 1.782 2 2l2.598 0.649c0.179 0.551 0.404 1.080 0.658 1.593l-1.462 2.438c-0.518 0.828-0.78 2.047 0 2.828l1.415 1.414c0.78 0.782 2.098 0.64 2.894 0.089l2.313-1.474c0.623 0.329 1.277 0.608 1.96 0.823l0.64 2.559c0.219 0.953 0.896 2 2 2h2c1.105 0 1.938-1.032 2.11-1.985l0.577-2.604c0.628-0.203 1.23-0.459 1.808-0.758l2.256 1.438c0.796 0.552 2.114 0.692 2.895-0.089l1.415-1.414c0.78-0.782 0.518-2 0-2.828l-1.39-2.317c0.279-0.549 0.521-1.12 0.716-1.714l2.599-0.649c0.953-0.219 2-0.895 2-2v-2c0-1.104-1.031-1.938-1.985-2.11zM30.001 16.939c-0.085 0.061-0.245 0.145-0.448 0.192l-3.708 0.926-0.344 1.051c-0.155 0.474-0.356 0.954-0.597 1.428l-0.502 0.986 1.959 3.267c0.125 0.2 0.183 0.379 0.201 0.485l-1.316 1.314c-0.127-0.040-0.271-0.092-0.341-0.14l-3.292-2.099-1.023 0.529c-0.493 0.256-0.999 0.468-1.503 0.631l-1.090 0.352-0.824 3.723c-0.038 0.199-0.145 0.36-0.218 0.417h-1.8c-0.061-0.085-0.145-0.245-0.191-0.448l-0.921-3.681-1.066-0.338c-0.549-0.173-1.097-0.404-1.63-0.684l-1.028-0.543-3.293 2.099c-0.135 0.091-0.279 0.143-0.409 0.143l-1.311-1.276c0.018-0.104 0.072-0.274 0.181-0.449l2.045-3.408-0.487-0.98c-0.227-0.462-0.407-0.895-0.547-1.325l-0.343-1.052-3.671-0.918c-0.231-0.052-0.398-0.139-0.485-0.2v-1.86c0.001 0.001 0.002 0.001 0.005 0.001 0.034 0 0.198-0.117 0.335-0.142l3.772-0.835 0.346-1.103c0.141-0.449 0.333-0.917 0.588-1.43l0.487-0.98-2.024-3.373c-0.125-0.201-0.184-0.38-0.201-0.485l1.315-1.314c0.128 0.041 0.271 0.093 0.34 0.14l3.354 2.138 1.027-0.542c0.527-0.278 1.073-0.507 1.622-0.682l1.063-0.338 0.912-3.649c0.053-0.231 0.138-0.398 0.2-0.485h1.859c-0.014 0.020 0.115 0.195 0.142 0.339l0.84 3.794 1.089 0.352c0.511 0.165 1.023 0.38 1.523 0.639l1.023 0.532 3.224-2.053c0.135-0.092 0.279-0.143 0.409-0.143l1.313 1.276c-0.017 0.104-0.072 0.276-0.181 0.45l-1.98 3.296 0.505 0.988c0.273 0.533 0.48 1.033 0.635 1.529l0.346 1.104 3.697 0.82c0.224 0.041 0.398 0.171 0.434 0.241zM16.013 9.99c-3.321 0-6.023 2.697-6.023 6.010s2.702 6.010 6.023 6.010 6.023-2.697 6.023-6.009c0-3.313-2.702-6.010-6.023-6.010zM16 20c-2.205 0-4-1.794-4-4s1.794-4 4-4c2.206 0 4 1.794 4 4s-1.794 4-4 4z"></path>
    </svg>`,
};
</script>

<template>
	<template v-if="props.raw">
		<span :id="state.id + '_button'" @click="onClick" style="display:contents;">
			<slot name="button"></slot>
		</span>
	</template>
	<div class="container" :id="state.id" :ref="(el) => (refs.container = el)">
		<div v-if="!props.raw" @click="onClick" class="dropdown-button" :id="state.id + '_button'" :style="props.buttonStyle">
			<div v-if="props.buttonSymbol != null" class="nav-icon icon-clickable" :ref="(el) => (refs.button = el)">
				{{ props.buttonSymbol }}
			</div>
			<svg v-else-if="props.svg" version="2.0" :style="iconStyle" preserveAspectRatio="xMidYMid meet" class="nav-icon icon-clickable">
				<use :href="props.svg" />
			</svg>
			<div v-else class="nav-icon icon-clickable">
				<slot name="button"></slot>
			</div>
		</div>
		<div class="dropdown-wrapper" :ref="(el) => (refs.dropdown = el)" style="z-index: 1" tabindex="0" v-if="props.body == null && $slots?.dropdown" @focus="onFocus">
			<div class="dropdown-head" :title="'state.stayOpen: ' + state.stayOpen" :ref="(el) => (refs.head = el)" :id="state.id + '_head'">
				<!-- https://www.svgrepo.com/svg/509197/pin -->
				<ImageBox title="Pin" :src="useAssets().assets.icons['pin-svgrepo-com.svg']" :inverted="true" :active="state.stayOpen" @click="state.stayOpen = !state.stayOpen" :style="{ border: 'none', }" /> <!-- padding: '0 3px' -->
				<!-- https://www.svgrepo.com/svg/366077/dialog-no -->
				<ImageBox title="Close" :src="useAssets().assets.icons['dialog-no-svgrepo-com.svg']" @click="state.open = false; toggleShow();" :style="{ 'margin-left': 'auto', border: 'none', }" /> <!-- padding: '0 5px' -->
			</div>
			<span class="dropdown" :id="state.id + '_body'" :ref="(el) => (refs.body = el)">
				<slot name="dropdown"></slot>
			</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

.container {

	position: relative;
	display: inline-block;
	align-self: center;
	width: fit-content;
}

.dropdown-button {
	align-self: center;
	display: inline-flex;
	align-items: stretch;
	height: 100%;
	cursor: pointer;
	width: fit-content;
	margin: 0;
	max-height: 100%;
}

.dropdown-wrapper {
	z-index: 999;
	display: none;
	flex-direction: column;
	position: fixed;
	width: fit-content;

	max-height: 93%;
	overflow: auto;

	background-color: #1e1e1e;
	color: #f5f5f5;
	border: 1px solid #f5f5f5;
	border-radius: 0.5ch;
	resize: both;
}

.dropdown-head {
	z-index: 1;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: stretch; // center
	position: sticky;
	top: 0;
	padding: 0 5px 0 8px;
	margin: 0;
	background-color: black;
	color: white;
	border-bottom: gray;
	height: 1em;
}

@media (max-width: 1366px) {
	.dropdown-head {
		//font-size:2em;
		height: 2em;
	}
}

.dropdown {
	flex-grow: 1;
	padding: 2px;
	display: block;
	overflow: auto;
	/* transition: all 2s; */
}
</style>
