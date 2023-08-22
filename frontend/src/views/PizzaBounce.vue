<template v-if="state.ready">
	<Teleport to="#extra-settings">
		<div class="pizza-menu">
			<button @click="eatPizza()" title="Pizza eat">eatPizza</button>
			<button @click="addPizza({ mixBlendMode: useStore().pizzabounce.config['mix-blend-mode'] })" title="Pizza add">addPizza</button>
			<div>
				mix-blend-mode:
				<select :value="useStore().pizzabounce.config['mix-blend-mode']" @change="useStore().pizzabounce.config['mix-blend-mode'] = $event.target.value" title="mix-blend-mode">
					<option v-for="(value, key) in mixBlendModes" :value="value[1]">{{ value[1] }}</option>
				</select>
				<button @click="addPizza({ mixBlendMode: 'randomblend' })" title="Pizza add with random mix-blend-mode">&#x1F3B2;</button>
			</div>

			<button @click="toggleRun()" style="width: 3ch" :title="useStore().pizzabounce.config.tickerOn ? 'Pizza Stop' : 'Pizza Start'">{{ useStore().pizzabounce.config.tickerOn ? String.fromCodePoint(0x23f8) : String.fromCodePoint(0x23f5) }}</button>

			<div class="two-col">
				<p>Pizza speed</p>
				<input title="Pizza speed" type="number" step="2" min="0" v-model="useStore().pizzabounce.config.v" style="width: 5ch" @change="onChange({ v: $event.target.value })" />
				<p>Pizza size</p>
				<input title="Pizza size" type="number" step="5" min="0" v-model="useStore().pizzabounce.config.d" style="width: 7ch" @change="onChange({ d: $event.target.value })" />
				<p>Toggle fullscreen</p>
				<button title="Pizza toggleFullScreen" @click="toggleFullScreen()" style="width: 3ch">{{ '\u2921' }}</button>

				<!-- BACKGROUND COLOR -->
				<p>BACKGROUND COLOR</p>
				<label :title="'Background color: ' + useStore().pizzabounce.config.backgroundColor">
					<input type="color" v-model="useStore().pizzabounce.config.backgroundColor" @change="onChangeBackground({ backgroundColor: $event.target.value })" style="height: 16px; width: 16px" />
					{{ useStore().pizzabounce.config.backgroundColor }}
				</label>

				<!-- BACKGROUND IMAGE -->
				<p>BACKGROUND IMAGE</p>
				<div>
					<button style="width: 3ch; background-color: rgb(15, 15, 15); color: chocolate" @click="state.addNewImage = !state.addNewImage" title="Add image">&#x1F589;</button>
					<select v-if="!state.addNewImage" id="selectBackground" name="background" :value="useStore().pizzabounce.config.backgroundImage" @change="onChangeBackground({ backgroundImage: $event.target.value })" title="Background image">
						<option v-for="(value, key) in useStore().pizzabounce.backgroundImages" :value="key" :title="value">{{ key }}</option>
					</select>
					<span v-else>
						<button style="width: 3ch; background-color: rgba(15, 15, 15); color: chocolate" @click="saveImageUrl(state.addNewImageName, state.addNewImageUrl)">&#x1F5AB;</button>
						<input type="text" style="width: 10ch" placeholder="image name" v-model="state.addNewImageName" />
						<input type="text" style="width: 20ch" placeholder="http://www.website.com/image.png" v-model="state.addNewImageUrl" />
					</span>
				</div>

				<!-- BACKGROUND FIT -->
				<p>BACKGROUND FIT</p>
				<select v-if="useStore().pizzabounce.config.backgroundImage != ''" :value="useStore().pizzabounce.config.backgroundSize" @change="onChangeBackground({ backgroundSize: $event.target.value })" title="Background size">
					<option value="initial">initial</option>
					<option value="auto">auto</option>
					<option value="cover">cover</option>
					<option value="contain">contain</option>
					<option value="100vw 100vh">100vw 100vh</option>
					<option value="100% 100%">100% 100%</option>
					<option value="initial">initial</option>
				</select>

				<!-- BACKGROUND REPEAT -->
				<p>BACKGROUND REPEAT</p>
				<select v-if="useStore().pizzabounce.config.backgroundImage != ''" :value="useStore().pizzabounce.config.backgroundRepeat" @change="onChangeBackground({ backgroundRepeat: $event.target.value })" title="Background repeat">
					<option value="initial">initial</option>
					<option value="repeat">repeat</option>
					<option value="repeat-x">repeat-x</option>
					<option value="repeat-y">repeat-y</option>
					<option value="no-repeat">no-repeat</option>
					<option value="space">space</option>
					<option value="round">round</option>
				</select>
			</div>

			<input type="range" min="0" max="99" v-model="useStore().pizzabounce.config.spin" :title="'Spin: ' + useStore().pizzabounce.config.spin" @change="onButtonClick({ id: 'changeSpin' })" />
			<label title="Display pizza info on the pizzas"> <input type="checkbox" v-model="useStore().pizzabounce.config.showPizzaInfo" @change="onButtonClick({ id: 'showPizzaInfo' })" /> <span class="prevent-select">Show info</span> </label>
		</div>
	</Teleport>
	<!-- <div v-else @click="useStore().pizzabounce.config.showControls = !useStore().pizzabounce.config.showControls">
		<button>{{ '\u2B9E' }}</button>
	</div> -->
	<div :ref="(el) => (refs.container = el)" class="container" >
		<template v-for="(value, key) in useStore().pizzabounce.pizzas" :key="key">
			<div :ref="(el) => (value.ref = el)" :style="value.style" class="pizza-container" v-show="state.ready">
				<img :src="images[state.image]" v-if="useStore().pizzabounce.pizzas[key]" :ref="(el) => (value.refPizza = el)" :style="[value.stylePizza, useStore().pizzabounce.config.spin == 0 ? {} : { animation: `rotating ${Math.abs(100 - useStore().pizzabounce.config.spin)}s linear infinite` }]" class="pizza" />
				<table v-if="useStore().pizzabounce.config.showPizzaInfo" class="info-table" :ref="(el) => (value.refInfo = el)">
					<tr v-if="value.direction">
						<td>{{ value.direction.x }}</td>
						<td>{{ value.direction.y }}</td>
					</tr>
					<tr>
						<td>{{ value.style.left }}</td>
						<td>{{ value.style.top }}</td>
					</tr>
					<tr>
						<td>Mode</td>
						<td>{{ value.stylePizza.mixBlendMode }}</td>
					</tr>
				</table>
			</div>
		</template>
	</div>
</template>

<style scoped>
.container {
	/* display:block;
	position:relative; */
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.pizza-menu {
	display: flex;
	flex-direction: column;
}

.two-col {
	display: grid;
	grid-template-columns: repeat(2, minmax(3ch, 1fr));
}

label>* {
	cursor: pointer;
}

.prevent-select {
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

input,
button {
	color: gray;
	background-color: black;
}

body {
	background-color: rgb(0, 0, 0);
}

html,
body,
#app {
	overflow: hidden;
	width: 100%;
	height: 100%;
}

.info-table {
	z-index: 0;
	position: absolute;
	background-color: gray;
	top: 50%;
	transform: translateY(-50%);
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
}

table,
tr,
td {
	width: fit-content;
}

table {
	border-collapse: collapse;
	align-self: center;
	justify-self: center;
	line-height: 1;
}

td {
	border: 1px solid red;
}

.pizza {
	object-fit: contain;
	width: 100%;
	height: 100%;
	transition: transform 1s;
}

.pizza-container {
	display: block;
	position: absolute;
	pointer-events: none;
	align-items: center;
	justify-content: center;
	transition: width 1s, height 1s;
}

@keyframes rotating {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.rotating {
	animation: rotating 3s linear infinite;
}
</style>

<script setup>
import { createApp, ref, reactive, nextTick, onMounted } from 'vue';
import { useStore, useConfig } from '@stores/store.js';
import { generateGUID } from '@scripts/scripts.js';
const refs = reactive({ container: null });
//const imagesglob = import.meta.glob('./../assets/icons/*.svg');
const icons = {
	floppyDisk: '\u{1F5AB}',
	space: '\u2003',
	pizza: '\uD83C\uDF55',
	arrowMenuHide: '\u2B9D',
	arrowMenuShow: '\u2B9F',
	arrowRight: '\u279C',
	arrowLeft: '\u27F5',
	arrowReplaceRight: '\u2B9E', // u2192, u226B, 2B9E, u27A4
	arrowReplaceLeft: '\u2B9C', // u2190, u226A, 2B9C,
};
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
	icon16: './pizza/icon16.png',
	icon32: './pizza/icon32.png',
	icon38: './pizza/icon38.png',
	icon48: './pizza/icon48.png',
	icon64: './pizza/icon64.png',
	icon128: './pizza/icon128.png',
	icon256: './pizza/icon256.png',
	icon512: './pizza/icon512.png',
};

const getRandomInt = (max) => Math.floor(Math.random() * max);
const randomDirection = () => Math.round(Math.random()) * 2 - 1;
const backgroundImagesDefaults = {
	'': '',
	//pizza: "url('./pizza/Kebabpizza2016.png')",
	beach1: "url('https://images.pexels.com/photos/351201/pexels-photo-351201.jpeg')",
	beach2: "url('https://images.pexels.com/photos/1021074/pexels-photo-1021074.jpeg')",
	mountain1: "url('https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg')",
	mountain2: "url('https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg')",
	mountain3: "url('https://images.pexels.com/photos/1752372/pexels-photo-1752372.jpeg')",
	mountain4: "url('https://images.pexels.com/photos/1553963/pexels-photo-1553963.jpeg')",
	city1: "url('https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg')",
	city2: "url('https://images.pexels.com/photos/6920581/pexels-photo-6920581.jpeg')",
	city3: "url('https://images.pexels.com/photos/421927/pexels-photo-421927.jpeg')",
	city4: "url('https://images.pexels.com/photos/294560/pexels-photo-294560.jpeg')",
	city5: "url('https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg')",
	city6: "url('https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg')",
	city7: "url('https://images.pexels.com/photos/3889865/pexels-photo-3889865.jpeg')",
};
function saveToLocalStorage({ what = 'settings' } = {}) {
	useConfig().save('pizzabounce', useStore().pizzabounce);
}
function saveImageUrl(addNewImageName, addNewImageUrl) {
	if (useStore().pizzabounce.backgroundImages[state.addNewImageName]) {
	} else {
		useStore().pizzabounce.backgroundImages[state.addNewImageName] = `url('${state.addNewImageUrl}')`;
		saveToLocalStorage({ what: 'backgroundImages' });
		state.addNewImageName = '';
		state.addNewImageUrl = '';
	}
}

const configDefaults = reactive({
	v: 2,
	d: 64 * 2,
	tickerOn: true,
	spin: 0,
	backgroundImage: 'mountain1',
	backgroundSize: 'cover',
	backgroundRepeat: 'repeat', // no-repeat, repeat
	backgroundColor: '#272727',
	'mix-blend-mode': 'normal',
	showPizzaInfo: false,
	//hideCursor: false,
});

//const useStore().pizzabounce.pizzas = reactive([]);
const wall = reactive({ w: 0, h: 0 });
const resizeObserver = new ResizeObserver((entries) => {
	wall.w = window.innerWidth;
	wall.h = window.innerHeight;
});

async function setPizzaSize(i) {
	await nextTick();
	if (useStore().pizzabounce.pizzas[i]) {
		useStore().pizzabounce.pizzas[i].ref.style.width = `${useStore().pizzabounce.config.d}px`;
		useStore().pizzabounce.pizzas[i].ref.style.height = `${useStore().pizzabounce.config.d}px`;
	}
}
const state = reactive({
	addNewImage: false,
	addNewImageName: '',
	addNewImageUrl: '',
	fullscreen: false,
	image: 'icon512',
	ready: false,
});

function init() {

	console.log('PIZZAS init', useStore().pizzabounce);
	if (Object.keys(useStore().pizzabounce.backgroundImages).length == 0) {
		useStore().pizzabounce.backgroundImages = backgroundImagesDefaults;
	}
	if (Object.keys(useStore().pizzabounce.config).length == 0) {
		Object.assign(useStore().pizzabounce.config, configDefaults)
	}
	if (Object.keys(useStore().pizzabounce.pizzas).length == 0) {
		//useStore().pizzabounce.pizzas = backgroundImagesDefaults
	}
	wall.w = window.innerWidth;
	wall.h = window.innerHeight;
	for (let i = 0; i < useStore().pizzabounce.pizzas.length; i++) {
		setPizzaSize(i);
	}
	state.ready = true;
	refs.container.style.backgroundImage = useStore().pizzabounce.backgroundImages[useStore().pizzabounce.config.backgroundImage];
	refs.container.style.backgroundSize = useStore().pizzabounce.config.backgroundSize;
	refs.container.style.backgroundRepeat = useStore().pizzabounce.config.backgroundRepeat;
	refs.container.style.backgroundPosition = 'center center';
	refs.container.style.backgroundColor = useStore().pizzabounce.config.backgroundColor;
	if (Object.keys(useStore().pizzabounce.pizzas).length == 0) addPizza();
	ticker();

	resizeObserver.observe(refs.container);
}
onMounted(() => {
	useStore().isReady('pizzabounce', init);
});

function onButtonClick({ id } = {}) {
	console.log('onButtonClick', id);
	// saveToLocalStorage({what='settings'}={})
	if (id == 'autosaveSettingsToLocalStorage') {
		saveToLocalStorage({ what: 'settings' });
		saveToLocalStorage({ what: 'backgroundImages' });
	}
	if (id == 'autosavePizzasToLocalStorage') saveToLocalStorage({ what: 'settings' });
	if (id == 'showPizzaInfo') saveToLocalStorage({ what: 'settings' });
	if (id == 'clearLocalstorage') localStorage.clear();
	if (id == 'changeSpin') saveToLocalStorage({ what: 'settings' });
}
function onChangeBackground({ backgroundImage, backgroundColor, backgroundSize, backgroundRepeat } = {}) {
	console.log('onChangeBackground', backgroundColor, backgroundImage, useStore().pizzabounce.backgroundImages[backgroundImage]);
	if (backgroundImage != null) {
		useStore().pizzabounce.config.backgroundImage = backgroundImage;
		useStore().pizzabounce.config.backgroundSize = useStore().pizzabounce.config.backgroundSize;
		refs.container.style.backgroundImage = useStore().pizzabounce.backgroundImages[backgroundImage];
	} else if (backgroundColor) {
		useStore().pizzabounce.config.backgroundColor = backgroundColor;
		refs.container.style.backgroundColor = backgroundColor;
	} else if (backgroundSize) {
		useStore().pizzabounce.config.backgroundSize = backgroundSize;
		refs.container.style.backgroundSize = backgroundSize;
	} else if (backgroundRepeat) {
		useStore().pizzabounce.config.backgroundRepeat = backgroundRepeat;
		refs.container.style.backgroundRepeat = backgroundRepeat;
	}
	saveToLocalStorage({ what: 'settings' });
}

async function addPizza({ mixBlendMode = 'normal' } = {}) {
	let obj = {
		uuid: await generateGUID(),
		ref: null,
		refPizza: null,
		style: { left: `${getRandomInt(wall.w - useStore().pizzabounce.config.d)}px`, top: `${getRandomInt(wall.h - useStore().pizzabounce.config.d)}px` },
		stylePizza: {},
		direction: null,
	};
	//if(!mode)	object.style.backdropFilter="grayscale(100%)"
	if (mixBlendMode == 'randomblend') {
		let blendMode = Math.floor(Math.random() * (mixBlendModes.length - 1));
		obj.stylePizza.mixBlendMode = mixBlendModes[blendMode][1];
	} else if (mixBlendMode) {
		obj.stylePizza.mixBlendMode = mixBlendMode;
	}
	useStore().pizzabounce.pizzas.push(obj);
	await nextTick();
	setPizzaSize(useStore().pizzabounce.pizzas.length - 1);
	saveToLocalStorage({ what: 'pizzas' });
}

function eatPizza() {
	if (useStore().pizzabounce.pizzas) useStore().pizzabounce.pizzas.shift();
	saveToLocalStorage({ what: 'pizzas' });
}

function toggleRun() {
	if (useStore().pizzabounce.config.tickerOn == null) useStore().pizzabounce.config.tickerOn = true;
	else useStore().pizzabounce.config.tickerOn = !useStore().pizzabounce.config.tickerOn;
	saveToLocalStorage({ what: 'settings' });
	ticker()
}


function test() {
	console.log('pizzas', { ...useStore().pizzabounce.pizzas },)
	console.log('config', { ...useStore().pizzabounce.config },)
	console.log('backgroundImages', { ...useStore().pizzabounce.backgroundImages },)
}
function ticker({ toggleTicker = true } = {}) {
	// ticker({toggleTicker:false})
	if (useStore().intervals.pizzabounce && !useStore().pizzabounce.config.tickerOn) useStore().intervals.pizzabounce = clearInterval(useStore().intervals.pizzabounce);
	else if (useStore().pizzabounce.config.tickerOn && !useStore().intervals.pizzabounce)
		useStore().intervals.pizzabounce = setInterval(async () => {
			//console.log('TICK', useStore().pizzabounce.pizzas, useStore().pizzabounce.config)
			for (let i = 0; i < useStore().pizzabounce.pizzas.length; i++) {
				//let rect = useStore().pizzabounce.pizzas[i].ref.getBoundingClientRect()
				//let curr = {x }
				//let curr = {x: parseInt(rect.left), y: parseInt(rect.top)};
				let curr = { x: parseInt(useStore().pizzabounce.pizzas[i].style.left), y: parseInt(useStore().pizzabounce.pizzas[i].style.top) };
				//console.log('curr', i, curr)
				if (!useStore().pizzabounce.pizzas[i].direction) useStore().pizzabounce.pizzas[i].direction = { x: await randomDirection(), y: await randomDirection() };

				let corr = useStore().pizzabounce.config.d * 0.07;
				if (curr.x < 0 - corr) useStore().pizzabounce.pizzas[i].direction.x = 1;
				else if (curr.x + useStore().pizzabounce.config.d > wall.w + corr) useStore().pizzabounce.pizzas[i].direction.x = -1;
				if (curr.y < 0 - corr) useStore().pizzabounce.pizzas[i].direction.y = 1;
				else if (curr.y + useStore().pizzabounce.config.d > wall.h + corr) useStore().pizzabounce.pizzas[i].direction.y = -1;

				useStore().pizzabounce.pizzas[i].style.left = `${curr.x + useStore().pizzabounce.config.v * useStore().pizzabounce.pizzas[i].direction.x}px`;
				useStore().pizzabounce.pizzas[i].style.top = `${curr.y + useStore().pizzabounce.config.v * useStore().pizzabounce.pizzas[i].direction.y}px`;
			}
		}, 10);
}

function onChange({ v, w, h, d } = {}) {
	for (let i = 0; i < useStore().pizzabounce.pizzas.length; i++) {
		if (v) useStore().pizzabounce.config.v = parseInt(v);
		if (d) {
			useStore().pizzabounce.config.d = parseInt(d);
			setPizzaSize(i);
			if (useStore().pizzabounce.config.d < 16 / 2) state.image = 'icon16';
			else if (useStore().pizzabounce.config.d < 32 / 2) state.image = 'icon32';
			else if (useStore().pizzabounce.config.d < 48 / 2) state.image = 'icon48';
			else if (useStore().pizzabounce.config.d < 64 / 2) state.image = 'icon64';
			else if (useStore().pizzabounce.config.d < 128 / 2) state.image = 'icon128';
			else if (useStore().pizzabounce.config.d < 256 / 2) state.image = 'icon256';
			else state.image = 'icon512';
		}
	}
	saveToLocalStorage({ what: 'settings' });
}
function toggleFullScreen() {
	if (!refs.container.fullscreenElement) {
		refs.container.requestFullscreen();
		//refs.container.documentElement.requestFullscreen();
	} else if (refs.container.exitFullscreen) {
		refs.container.exitFullscreen();
	}
	state.fullscreen = !state.fullscreen;
	//saveToLocalStorage({what: 'settings'});
}
</script>
