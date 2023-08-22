<script setup>
import ContextMenu from '@scripts/contextmenu.js'
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';

const props = defineProps({});


const mixBlendModes = [
	['mix-blend-mode', 'normal'],
	['mix-blend-mode', 'multiply'],
	['mix-blend-mode', 'screen'],
	['mix-blend-mode', 'overlay'],
	['mix-blend-mode', 'darken'],
	['mix-blend-mode', 'lighten'],
	['mix-blend-mode', 'color-dodge'],
	['mix-blend-mode', 'color-burn'],
	['mix-blend-mode', 'hard-light'],
	['mix-blend-mode', 'soft-light'],
	['mix-blend-mode', 'difference'],
	['mix-blend-mode', 'exclusion'],
	['mix-blend-mode', 'hue'],
	['mix-blend-mode', 'saturation'],
	['mix-blend-mode', 'color'],
	['mix-blend-mode', 'luminosity'],
];


const images = {
	icon16: '/pizza/icon16.png',
	icon32: '/pizza/icon32.png',
	icon38: '/pizza/icon38.png',
	icon48: '/pizza/icon48.png',
	icon64: '/pizza/icon64.png',
	icon128: '/pizza/icon128.png',
	icon256: '/pizza/icon256.png',
	icon512: '/pizza/icon512.png',
};

const refs = reactive({ container: null });
const state = reactive({
	spinVal: 10,
	overPizza: null,
	randomIndex: true,
});
const configDefault = {
	bringToFrontOnHover: false,
	mixBlendModesOnHover: true,
	randomIndex: true,
	pizzasPerRow: 30,
	image: 'icon256',
	rps: 5,
}
const config = reactive(structuredClone(configDefault))

function initConfig() {
	const url = new URL(location);
	for (const key of Object.keys(config)) {
		let param = url.searchParams.get(key)	// toString()	getAll()
		if (param) param = decodeURIComponent(param)
		//if (params) params = JSON.parse(params)
		if (typeof param == 'object') Object.assign(config[key], param)
		else if (param != null) {
			try {
				config[key] = JSON.parse(param)
			} catch {
				config[key] = param
			}

		}
		console.log('initConfig', key, param, config[key])
	}
}

function setUrlParams(key) {
	const url = new URL(location);
	if (key && configDefault[key] == config[key]) url.searchParams.delete(key)
	else if (key) url.searchParams.set(key, encodeURIComponent(config[key]));
	else url.searchParams.set("", encodeURIComponent(JSON.stringify(config)));
	history.replaceState({}, "", url); // replaceState, pushState
}

onMounted(() => {
	//Object.assign(config, configDefault)
	console.log('onMounted1', config)
	initConfig()
	console.log('onMounted2', config)

	document.getElementById('pizzaspin-shades').style.animation = '5s shade-in'

	loadPizzas()
	let container = document.getElementById('pizzaspin-container')
	resizeObserver.observe(container);
	container.addEventListener('click', pizzaClick)
	container.addEventListener('mousemove', pizzaHover)
	//let params = getUrlParams()
	//if (typeof params == 'object') Object.assign(config, params)



	new ContextMenu(container, [
		{
			text: 'Fullscreen', func: () => {
				container.requestFullscreen();
			}
		},
		{
			text: 'bringToFrontOnHover', value: config.bringToFrontOnHover, func: () => {
				config.bringToFrontOnHover = !config.bringToFrontOnHover;
				setUrlParams('bringToFrontOnHover')
				loadPizzas()
			}
		},
		{
			text: 'mixBlendModesOnHover', value: config.mixBlendModesOnHover, func: () => {
				config.mixBlendModesOnHover = !config.mixBlendModesOnHover;
				setUrlParams('mixBlendModesOnHover')
				loadPizzas()

			}
		},
		{
			text: 'randomIndex', value: config.randomIndex, func: () => {
				config.randomIndex = !config.randomIndex
				setUrlParams('randomIndex')
				loadPizzas()
			}
		},
		{
			element: 'input', type: 'number', value: config.pizzasPerRow, title: 'pizzasPerRow', func: (e) => {
				if (e.target.value > 100) {
					let ans = confirm("Are you sure about that?");
					console.log('ans', ans)
					if (!ans) return false
				}
				config.pizzasPerRow = e.target.value;
				setUrlParams('pizzasPerRow')
				loadPizzas()
				return true
			}
		},
		{
			element: 'input', type: 'number', value: config.rps, title: 'rps', closeOnClick: false, func: (e) => {
				if (e.target.value <= 0) {
					return false
				}
				config.rps = e.target.value;
				setUrlParams('rps')
				loadPizzas()
				return true
			}
		},
		{
			element: 'select', value: config.image, title: 'image', func: (e) => {
				config.image = e.target.value;
				setUrlParams('image')
				loadPizzas()
			}, options: Object.keys(images)
		},
		//{text: 'pizzasPerRow', func: ()=>config.randomIndex =! config.randomIndex},
	]);


});




function pizzaHover(e) {
	let pizza = document.elementFromPoint(e.clientX, e.clientY)
	if (!pizza) return
	let pizzaDiv = pizza.closest(`.pizzaspin-div`)
	if (!pizzaDiv) return
	let pizzaId = pizzaDiv.style.left + pizzaDiv.style.top
	if (state.overPizza == pizzaId) return
	state.overPizza = pizzaId

	if (pizzaDiv) {
		if (config.bringToFrontOnHover) pizzaDiv.style.zIndex = '10000'
		if (config.mixBlendModesOnHover) pizzaDiv.style.mixBlendMode = randomBlend()
	}
}
function pizzaClick(e) {
	let pizza = document.elementFromPoint(e.clientX, e.clientY)
	if (pizza) {
		pizza.style.height = '500%'
		pizza.style.mixBlendMode = 'difference'
	}
	let pizzaDiv = e.target.closest(`.pizzaspin-div`)
	if (pizzaDiv) {
		pizzaDiv.style.zIndex = '10'
		pizzaDiv.style.transform = 'translateX(-250%) translateY(-250%)'
		pizzaDiv.style.mixBlendMode = randomBlend()
	}
}

const resizeObserver = new ResizeObserver((entries) => {
	loadPizzas()
});
function randomBlend() {
	let blendIndex = Math.floor(Math.random() * mixBlendModes.length)
	let blendstr = `${mixBlendModes[blendIndex][0]}:${mixBlendModes[blendIndex][1]};`
	//console.log('blendIndex', blendIndex, mixBlendModes.length, blendstr)
	return mixBlendModes[blendIndex][1]
}
function loadPizzas() {
	let pizzaWidth = window.innerWidth / config.pizzasPerRow
	let html = ``
	let posX = -pizzaWidth / 2
	let posY = -pizzaWidth / 2
	let pizzaCount = 0
	while (true) {
		pizzaCount++
		let pizzaspinDivStyle = `position:fixed;left:${posX}px; top:${posY}px; width:${pizzaWidth}px; height:${pizzaWidth}px;`
		if (config.randomIndex) {
			let zIndex = Math.floor(Math.random() * 100)
			pizzaspinDivStyle += `z-index:${zIndex};`
		}
		// animation: 10s ease-out 0s 1 enterTheArena;
		html += `<div class="pizzaspin-div" style="animation: 2s ease-in enterTheArena;${pizzaspinDivStyle}"><img src="${images[config.image] ? images[config.image] : 'pizza/icon64.png'}" alt="" class="pizzaspin-img" style="animation: rotating ${config.rps}s linear infinite;" /></div> `
		posX += pizzaWidth
		if (posX > window.innerWidth) {
			posX = -pizzaWidth / 2
			posY += pizzaWidth
		}
		if (posY > window.innerHeight) break
	}
	if (refs.container) refs.container.innerHTML = html
}


</script>

<template >
	<div style="left:0;top:0;pointer-events: none;position:fixed; width:100%; height:100%; z-index: 1000;" id="pizzaspin-shades"></div>
	<div :ref="(el) => refs.container = el" style="display:none;position:fixed;width:fit-content;height:fit-content;background-color: rgba(25,25,25,0.5);">
		<div class="row"> </div>
	</div>
	<div style="display:block; width:100%;height: 100%;" id="pizzaspin-container" :ref="(el) => refs.container = el"> </div>
</template>

<style  lang="scss">
.div {
	position: fixed;
	width: 15vh;
	height: 15vh;
}

.row {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
}

#pizzaspin-container {
	pointer-events: none;
}

.pizzaspin-div {
	pointer-events: none;
	//perspective: 200px;
}

.pizzaspin-img {
	pointer-events: auto;
	background: none;
	background-color: transparent;
	height: 200%;
}

.pizzaspin-img:hover {
	animation: rotating-reverse 1s linear infinite;
}


@keyframes shade-in {
	0% {
		background-color: rgba(0, 0, 0, 0.5);
	}

	100% {
		background-color: rgba(0, 0, 0, 0);
	}
}

@keyframes enterTheArena {
	0% {
		//filter: saturate(0%);
		//filter: invert(100%);
		//filter: grayscale(100%);
		//filter: hue-rotate(0deg);
		scale: 0;
		//transform: translateX(-100%);
	}

	100% {
		//filter: saturate(100%);
		//filter: invert(0%);
		//filter: grayscale(0%);
		//filter: hue-rotate(360deg);
		scale: 1;
		//transform: translateX(0);
	}
}
</style>
