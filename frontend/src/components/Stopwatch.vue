<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useStore, useNextCloud, useConfig, useAssets } from '@stores/store.js';
import { onMounted, reactive, nextTick, watch } from 'vue';
import { Stopwatch } from '@scripts/time/stopwatch.js';
import { generateID } from '@scripts/scripts.js';

function log() {
	if (window.Console) Console.log({ file: 'Stopwatch.vue', ...arguments })
}

const props = defineProps({
	id: null,
	columns: { default: {} },
	minimal: { default: false },
});
const refs = reactive({ stopwatchcontainer: null, dropdownContainer: null, stopwatches: null });
const state = reactive({
	id: 'sw-' + Date.now(),
	open: false,
	stayOpen: false,
	stopwatches: {},
	holdingId: null,
	holdingRow: null,
});

const columns = reactive({
	drag: { gridColumn: 'fit-content(5ch)', show: true, order: 2 },
	setWindowTitle: { gridColumn: 'fit-content(1ch)', show: true, order: 2 },
	remove: { gridColumn: 'fit-content(5ch)', show: true, order: 3 },
	reset: { gridColumn: 'fit-content(1ch)', show: true, order: 4 },
	startstop: { gridColumn: 'fit-content(5ch)', show: true, order: 5 },
	fullTime: { gridColumn: 'fit-content(8ch)', show: true, order: 10 },
	title: { gridColumn: 'fit-content(100%)', show: true, order: 12 },
});

function getGridTemplateColumns() {
	return Object.entries(columns).reduce((a, [key, value]) => {
		if (value.show) a += ' ' + value.gridColumn;
		return a;
	}, '');
}

function initStopwatches() {
	if (Object.keys(useStore().stopwatches).length == 0) {
		addStopwatch()
	} else {
		let sorted = sort(useStore().stopwatches, 'order');
		for (let i = 0; i < sorted.length; i++) {
			useStore().stopwatches[sorted[i].id] = new Stopwatch({ ...useStore().stopwatches[sorted[i].id] });
			if (!useStore().listOrder.stopwatches.includes(sorted[i].id)) useStore().listOrder.stopwatches.push(sorted[i].id)
		}
	}
	ticker();
}


function init() {
	log('STOPWATCHES INIT', useStore().stopwatches);
	if (props.id != null) state.id = props.id;
	initStopwatches();
	//fixOrder();
}


onMounted(() => {
	for (const key in props.columns) {
		if (columns[key]) Object.assign(columns[key], props.columns[key])
	}
	refs.stopwatches.style.gridTemplateColumns = getGridTemplateColumns();
	useStore().isReady('stopwatches', init);
});
function sort(obj, key) {
	try {
		return Object.values(obj).sort((a, b) => parseInt(a[key]) - parseInt(b[key]));
	} catch (err) {
		return null;
	}
}
function ticker() {
	if (!useStore().stopwatches) return;
	let anyActive = Object.values(useStore().stopwatches).reduce((a, c) => (a || c.running ? true : false), false);
	if (!useStore().intervals.stopwatches && anyActive)
		useStore().intervals.stopwatches = setInterval(() => {
			for (const [key, value] of Object.entries(useStore().stopwatches)) {
				if ((!value.running && value.fullTime != null) || !value.getElapsedTimeFormatted) continue;
				value.getElapsedTimeFormatted('object');
				if (value.setAsWindowTitle) {
					useConfig().setWindowTitle('stopwatch', value.fullTime + '\u23F1');
				}
			}
		}, useStore().stopwatches_settings.updateFrequency);
	else if (!anyActive) clearInterval(useStore().intervals.stopwatches);
}
function changeWindowTitle(key) {
	for (const [k, v] of Object.entries(useStore().stopwatches)) {
		if (key == k) useStore().stopwatches[k].setAsWindowTitle = !useStore().stopwatches[k].setAsWindowTitle;
		else useStore().stopwatches[k].setAsWindowTitle = false;
	}
	if (!useStore().stopwatches[key].setAsWindowTitle) useConfig().setWindowTitle('stopwatch', null); //document.title = title.default
	save('changeWindowTitle');
}
function addStopwatch() {
	let id = generateID();
	useStore().stopwatches[id] = new Stopwatch({ id, running: true, order: Object.keys(useStore().stopwatches).length });	// createdAt: id, 
	if (!useStore().listOrder.stopwatches.includes(id)) {
		useStore().listOrder.stopwatches.splice(0, 0, id)
		fixOrder()
	}
	save('addStopwatch');
}
function removeStopwatch(id) {
	if (useStore().stopwatches[id].setAsWindowTitle) useConfig().setWindowTitle('stopwatch', null);
	useStore().listOrder.stopwatches.splice(useStore().stopwatches[id].order, 0, id)
	delete useStore().stopwatches[id];
	fixOrder()
	save('removeStopwatch');
}
function save() {
	useConfig().save('stopwatches', useStore().stopwatches);
}
function changeFrequency(e) {
	useStore().intervals.stopwatches = clearInterval(useStore().intervals.stopwatches);
	ticker();
	save('changeFrequency');
}
function toggleRun(uuid) {
	useStore().stopwatches[uuid].toggle();
	ticker();
	save('toggleRun');
}
function titleChange(e, uuid) {
	let text = e.target.innerText;
	useStore().stopwatches[uuid].title = text;
	save('titleChange');
}
function reset(id) {
	useStore().stopwatches[id].reset();
	useStore().stopwatches[id].fullTime = '00'
	save('reset');
}

function pointerdown(e, id, i) {
	state.holdingId = id;
	state.holdingRow = i;
	useStore().refs.cover.show();
	document.body.style.cursor = 'grabbing'; // grab, grabbing, move	 !important
	window.addEventListener('pointerup', pointerup);
	window.addEventListener('pointerleave', pointerup);
	window.addEventListener('pointermove', pointermove);
}
function pointerup(e) {
	if (state.changedOrder) save('pointerup')
	state.changedOrder = false
	//e.preventDefault()
	//e.stopPropagation()
	//e.stopImmediatePropagation()
	useStore().refs.cover.hide();
	state.holdingRow = null;
	document.body.style.cursor = 'auto';
	window.removeEventListener('pointerup', pointerup);
	window.removeEventListener('pointerleave', pointerup);
	window.removeEventListener('pointermove', pointermove);
}
function pointermove(e) {
	state.holdingRow = useStore().stopwatches[state.holdingId].order;
	if (e.touches?.[0]) e = e.touches[0];
	let elements = document.elementsFromPoint(e.clientX, e.clientY);
	const row = elements.reduce((a, c) => {
		if (a != null) return a;
		if (c.id.includes('stopwatchrow-')) a = parseInt(c.id.split('-').at(-1));
		return a;
	}, null);
	if (row != null && state.holdingRow != row) {
		let move = useStore().listOrder.stopwatches.splice(state.holdingRow, 1)
		useStore().listOrder.stopwatches.splice(row, 0, move[0])
		fixOrder()
		state.changedOrder = true
	}
}
function fixOrder() {
	for (let i = 0; i < useStore().listOrder.stopwatches.length; i++) {
		let id = useStore().listOrder.stopwatches[i]
		useStore().stopwatches[id].order = i;
	}
}
</script>

<template>
	<div :id="state.id" :ref="(el) => (refs.stopwatchcontainer = el)">
		<template v-if="useStore().refs.extraSettings && useStore().currentPage.name == 'stopwatch'">
			<Teleport :to="useStore().refs.extraSettings" v-if="!props.minimal">
				<span id="stopwatch-extra-settings">
					<button @click="addStopwatch">Add</button>
					<input type="number" v-model="useStore().stopwatches_settings.updateFrequency" @change="changeFrequency" />
				</span>
			</Teleport>
		</template>
		<span>
			<button @click="addStopwatch">Add</button>
		</span>
		<span class="time-table" :ref="(el) => (refs.stopwatches = el)">
			<div v-for="(id, i) in useStore().listOrder.stopwatches" class="row">
				<template v-for="(colObj, colKey) in columns" v-if="id && useStore().stopwatches[id]">

					<div v-if="colObj.show" :id="'stopwatchrow-' + i" class="grid-item" :class="[(state.holdingRow == i) ? 'grid-item-highlighted' : '']">
						<ImageBox title="Drag" v-if="colKey == 'drag'" :src="useAssets().assets.icons['size-svgrepo-com.png']" :style="{ cursor: 'grab' }" :active="state.holdingRow == i" @pointerdown="pointerdown($event, id, i)" />

						<template v-if="colKey == 'setWindowTitle'">
							<!-- https://www.svgrepo.com/svg/491155/visible https://www.svgrepo.com/svg/491289/not-visible  -->
							<ImageBox v-if="useStore().stopwatches[id].setAsWindowTitle" title="Set duration as window title" @click.prevent.stop="changeWindowTitle(id)" :src="useAssets().assets.icons['visible-svgrepo-com.svg']" :inverted="true" />
							<ImageBox v-else title="Set duration as window title" @click.prevent.stop="changeWindowTitle(id)" :src="useAssets().assets.icons['not-visible-svgrepo-com.svg']" />
						</template>
						<!-- https://www.svgrepo.com/svg/491188/bin -->
						<ImageBox v-if="colKey == 'remove'" title="Remove stopwatch" @click.prevent.stop="removeStopwatch(id)" :src="useAssets().assets.icons['bin-svgrepo-com.svg']" :inverted="true" />
						<!-- <SvgBin v-if="colKey == 'remove'" title="Remove stopwatch" @click="removeStopwatch(id)" /> -->

						<!-- https://www.svgrepo.com/svg/488668/restart -->
						<ImageBox v-if="colKey == 'reset'" title="Restart stopwatch" @click.prevent.stop="reset(id)" :src="useAssets().assets.icons['restart-svgrepo-com.svg']" :inverted="true" />
						<!-- <SvgRestart v-if="colKey == 'reset'" title="Restart stopwatch" @click="reset(id)" /> -->

						<template v-if="colKey == 'startstop'">
							<!-- https://www.svgrepo.com/svg/491305/play https://www.svgrepo.com/svg/491298/pause -->
							<ImageBox v-if="useStore().stopwatches[id].running" title="Pause stopwatch" :src="useAssets().assets.icons['pause-svgrepo-com.svg']" @click.prevent.stop="toggleRun(id)" />
							<ImageBox v-else title="Start stopwatch" :src="useAssets().assets.icons['play-svgrepo-com.svg']" :inverted="true" @click.prevent.stop="toggleRun(id)" />
						</template>

						<div v-if="colKey == 'fullTime'" class="time-display">{{ useStore().stopwatches[id].fullTime }}</div>

						<div v-if="colKey == 'title'" contenteditable="true" spellcheck="false" class="title" @blur="titleChange($event, id)">{{ useStore().stopwatches[id].title }}</div>
					</div>
				</template>
			</div>


		</span>
	</div>
</template>

<style scoped lang="scss">
* {
	box-sizing: border-box;
	margin: 0;
}

.container {
	display: inline-block;
	width: fit-content;
	height: fit-content;
}

.grid {
	display: grid;
	width: fit-content;
	white-space: nowrap;
	line-height: 1.3;
}

.row {
	display: contents;
}

.time-display {
	text-align: right;
	width: 100%;
	vertical-align: middle;
	padding: 0 4px;
}

.title {
	vertical-align: middle;
	padding: 0 8px;
	text-align: left;
	width: 100%;
	min-width: 20ch;
	border-bottom: 1px dashed gray;
	overflow: hidden;
}
</style>
