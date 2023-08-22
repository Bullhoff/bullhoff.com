<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useStore, useNextCloud, useConfig, useAssets, useStyle } from '@stores/store.js';
import { onMounted, reactive, nextTick, watch } from 'vue';
import { Countdown } from '@scripts/time/countdown.js'; // stopwatches
import { generateGUID, capitalize } from '@scripts/scripts.js';
import pizza from './../assets/pizza/icon64.png';
import alarm from './../assets/icons/clock-alarm-svgrepo-com.svg';
import Dropdown from '@components/Dropdown.vue';
import { SvgVisible, SvgNotVisible, SvgBin, SvgRestart, SvgPlay, SvgPause } from './SvgIcons.vue';
function log() {
	if (window.Console) Console.log({ file: 'Countdown.vue', ...arguments })
}
const props = defineProps({
	id: null,
	columns: { default: {} },
	minimal: { default: false },
});
const refs = reactive({ stopwatchcontainer: null, dropdownContainer: null, countdowns: null, cover: null });
const state = reactive({
	id: 'sw-' + Date.now(),
	open: false,
	stayOpen: false,
	stopwatches: {},
	ready: false,
	holdingRow: null,
	holdingId: false,
});

const columns = reactive({
	drag: { gridColumn: 'fit-content(20ch)', show: true, order: 1 },
	clone: { gridColumn: 'fit-content(20ch)', show: true, order: 3 },
	remove: { gridColumn: 'fit-content(20ch)', show: true, order: 2 },
	options: { gridColumn: 'fit-content(20ch)', show: true, order: 5 },
	date: { gridColumn: 'fit-content(20ch)', show: true, order: 5 },
	time: { gridColumn: 'fit-content(20ch)', show: true, order: 6 },
	output: { gridColumn: 'fit-content(20ch)', show: true, order: 7, showDate: true, showTime: true },
	title: { gridColumn: 'fit-content(20ch)', show: true, order: 8 },
	reminders: { gridColumn: 'fit-content(20ch)', show: true, order: 9 },
});

function getGridTemplateColumns() {
	return Object.entries(columns).reduce((a, [key, value]) => {
		if (value.show) a += ' ' + value.gridColumn;
		return a;
	}, '');
}

onMounted(() => {
	for (const key in props.columns) {
		if (columns[key]) Object.assign(columns[key], props.columns[key])
	}
	useStore().isReady('countdowns', init);
});
function init() {
	let sorted = sort(useStore().countdowns, 'order');
	for (let i = 0; i < sorted.length; i++) {
		useStore().countdowns[sorted[i].id] = new Countdown({ ...useStore().countdowns[sorted[i].id], onComplete, onTick, onChange: save });
		if (!useStore().listOrder.countdowns.includes(sorted[i].id)) useStore().listOrder.countdowns.push(sorted[i].id)
	}

	useStore().startInterval('countdowns', onTick, true);
	state.ready = true;
	refs.countdowns.style.gridTemplateColumns = getGridTemplateColumns();
	fixOrder();
}
function sort(obj, key) {
	try {
		return Object.values(obj).sort((a, b) => parseInt(a[key]) - parseInt(b[key]));
	} catch (err) {
		return null;
	}
}
function save() {
	useConfig().save('countdowns', useStore().countdowns);
}
function addRow() {
	let id = generateGUID();
	useStore().countdowns[id] = new Countdown({ id: id, onComplete, onTick, order: Object.keys(useStore().countdowns).length });
	if (!useStore().listOrder.countdowns.includes(id)) {
		useStore().listOrder.countdowns.splice(0, 0, id)
		fixOrder()
	}
	save('addRow');
}
function onChange(e, uuid, field) {
	let val = e?.target?.value;
	if (!val && typeof e == 'string') val = e;
	else if (!val) return;
	useStore().countdowns[uuid][field] = val;
	if (useStore().countdowns[uuid]?.updateTime && typeof useStore().countdowns[uuid].updateTime == 'function') useStore().countdowns[uuid].updateTime();
	save('onChange');
}

function onTick(e) {
	for (const [key, value] of Object.entries(useStore().countdowns)) {
		if (value.getTimeLeft && typeof value.getTimeLeft == 'function') value.getTimeLeft();
	}
}
function onComplete(e) {
	log('onComplete', e);
	save('onComplete');
}
function titleChange(e, uuid) {
	let text = e.target.innerText;
	log('titleChange', uuid, text, e);
	useStore().countdowns[uuid].title = text;
	save('titleChange');
}

function remove(id, i) {
	log('remove', { id, i })
	useStore().listOrder.countdowns.splice(i, 1)
	delete useStore().countdowns[id];
	fixOrder();
	save('remove');
}
function clone(id, i) {
	log('clone', { id, i })
	let newObj = { ...useStore().countdowns[id] };
	newObj.id = generateGUID();
	useStore().countdowns[newObj.id] = new Countdown(newObj);
	useStore().listOrder.countdowns.splice(i, 0, newObj.id)
	fixOrder()
	save('clone');
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
	state.holdingRow = useStore().countdowns[state.holdingId].order;
	if (e.touches?.[0]) e = e.touches[0];
	let elements = document.elementsFromPoint(e.clientX, e.clientY);
	const row = elements.reduce((a, c) => {
		if (a != null) return a;
		if (c.id.includes('countdownrow-')) a = parseInt(c.id.split('-').at(-1));
		return a;
	}, null);
	if (row != null && state.holdingRow != row) {
		let move = useStore().listOrder.countdowns.splice(state.holdingRow, 1)
		useStore().listOrder.countdowns.splice(row, 0, move[0])
		fixOrder()
		state.changedOrder = true
	}
}
function fixOrder(obj = useStore().countdowns) {
	for (let i = 0; i < useStore().listOrder.countdowns.length; i++) {
		let id = useStore().listOrder.countdowns[i]
		if (useStore().countdowns[id]) useStore().countdowns[id].order = i;
	}
}
</script>

<template v-if="state.ready">
	<Teleport :to="useStore().refs.extraSettings" v-if="useStore().refs.extraSettings && useStore().currentPage.name == 'stopwatch' && !props.minimal"> </Teleport>

	<div :id="state.id" :ref="(el) => (refs.countdownscontainer = el)" v-if="useStore().finishedLoading.countdowns">
		<span><button @click="addRow">Add</button></span>

		<div class="time-table" :ref="(el) => (refs.countdowns = el)">
			<span v-for="(id, i) in useStore().listOrder.countdowns" style="display: contents">
				<template v-for="(colObj, colKey) in columns" v-if="id && useStore().countdowns[id]">
					<div v-if="colObj.show" :id="'countdownrow-' + i" class="grid-item" :class="[(state.holdingRow == i) ? 'grid-item-highlighted' : '']">
						<ImageBox :title="{ id, i }" v-if="colKey == 'drag' && columns.drag.show" :src="useAssets().assets.icons['size-svgrepo-com.png']" :style="{ cursor: 'grab', height: `${useStyle().rowHeight}em` }" :active="state.holdingRow == i" @pointerdown="pointerdown($event, id, i)" />
						<ImageBox title="Clone" v-if="colKey == 'clone'" :src="useAssets().assets.icons['replicate-alt-svgrepo-com.svg']" :style="{ height: `${useStyle().rowHeight}em` }" @click="clone(id, i)" />
						<ImageBox title="Remove" v-if="colKey == 'remove'" :src="useAssets().assets.icons['bin-svgrepo-com.svg']" :style="{ height: `${useStyle().rowHeight}em` }" @click="remove(id, i)" :inverted="true" />

						<div v-if="colKey == 'options' && columns.options.show" style="display:contents" class="">
							<Dropdown :buttonStyle="{ width: '100%' }" raw="true">
								<template v-slot:button>
									<!-- https://www.svgrepo.com/svg/10207/settings -->
									<ImageBox title="Settings" :src="useAssets().assets.icons['settings-svgrepo-com.svg']" />
								</template>
								<template v-slot:dropdown>
									<div style="display: flex; flex-direction: column; width: fit-content">
										<div style="display: flex; flex-direction: row; align-items: center">
											<Dropdown :buttonStyle="{ width: '100%', 'background-color': 'chocolate' }" raw="true">
												<template v-slot:button>
													<button>Repeat: {{ capitalize(useStore().countdowns[id].repeat) }}</button>
												</template>
												<template v-slot:dropdown>
													<span style="display: flex; flex-direction: column" @click="(e) => { useStore().countdowns[id].repeat = e.target.textContent.toLowerCase(); }">
														<button>Yearly</button>
														<button>Monthly</button>
														<button>Weekly</button>
														<button>Daily</button>
														<button>Hourly</button>
														<button>Minutely</button>
														<button>Secondly</button>
														<button>Once</button>
													</span>
												</template>
											</Dropdown>
										</div>
										<div>

											<details open>
												<summary style="cursor:pointer;"><b><u style="pointer-events: none;" class="prevent-select">Alarms/Reminders</u></b></summary>
												<tr>
													<th></th>
													<th></th>
													<th>Message</th>
													<th>ontimeleft</th>
													<th>Alarm settings</th>
												</tr>
												<tr v-for="(alarm, i) in useStore().countdowns[id].alarms">
													<td><button @click="useStore().countdowns[id].removeAlarm(i)">-</button></td>
													<td><input type="checkbox" v-model="alarm.on" @change="save()" /></td>
													<td><input type="text" v-model="alarm.body" @change="save()" /></td>
													<td>
														<input type="number" style="width:4em;" v-model="alarm.ontimeleft" @change="save()" />
														<select v-model="alarm.unit" @change="save()">
															<option>days</option>
															<option>hours</option>
															<option>minutes</option>
														</select>
													</td>
													<td></td>
												</tr>
												<button @click="useStore().countdowns[id].addAlarm()">Add reminder</button>
											</details>
										</div>
									</div>
								</template>
							</Dropdown>
						</div>
						<Input v-if="colKey == 'date' && columns.date.show" type="date" :value="useStore().countdowns[id].finishDate" @onChange="(val) => onChange(val, id, 'finishDate')" />
						<Input v-if="colKey == 'time' && columns.time.show" type="time" :value="useStore().countdowns[id].finishTime" @onChange="onChange($event, id, 'finishTime')" showButton="true" />
						<div v-if="colKey == 'output' && columns.output.show" style="width: 100%; display: flex; flex-direction: row; align-items: end">
							<p v-if="columns.output.showDate && useStore().countdowns?.[id]?.timeleft.d > 0" v-text="useStore().countdowns?.[id]?.timeleft.d + '\u1D48\u2002'"></p>
							<p v-if="columns.output.showTime" style="width: fit-content; margin-left: auto" v-text="useStore().countdowns?.[id]?.timeleft.timeStr"></p>
						</div>
						<div v-if="colKey == 'title' && columns.title.show" contenteditable="true" spellcheck="false" class="title" @blur="titleChange($event, id)">{{ useStore().countdowns?.[id]?.title }}</div>
					</div>
				</template>
			</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
* {
	box-sizing: border-box;
	margin: 0;
}

.countdowns-container {
	line-height: 1;
	display: grid;
	align-items: center;

	* {
		white-space: nowrap;
		width: 100%;
		height: 100%;
		align-content: center;
	}
}

.icon-countdown {
	display: block;
	position: relative;
	box-sizing: border-box;
	object-fit: contain;
	object-position: 50% 50%;
	border-radius: 0.5ch;
	border: 1px solid gray;
	min-width: 1em;
	max-width: fit-content;
	width: 1em;
	height: 1em;
}

.icon-countdown:hover {
	background-color: yellow;
}

.row {
	display: grid;
	grid-template-columns: repeat(20, fit-content(50ch));
	align-items: center;
	line-height: 1;
}

.icon-inverted {
	-webkit-filter: invert(1);
	filter: invert(1);
	border: 1px solid chocolate;
}

.icon-inverted-active {
	background-color: rgba(235, 235, 235, 0.8);
}

.icon {
	object-fit: contain;
	height: 2.3ch;
	cursor: pointer;
	border-radius: 2px;
	vertical-align: middle;
	padding: 2px;
}

.icon-active {
	background-color: rgba(149, 253, 108, 0.8);
	border: 1px solid white;
}

.container {
	display: inline-block;
	width: fit-content;
	height: fit-content;
}

.time-display {
	text-align: right;
	vertical-align: middle;
	padding: 0 4px;
}

.title {
	vertical-align: middle;
	padding: 0 8px;
	text-align: left;
	width: 100%;
	min-width: 10ch;
	border-bottom: 1px dashed gray;
	padding: 0 9px;
	overflow: hidden;
}

.button {
	cursor: pointer;
	background-color: rgba(50, 50, 50, 0.5);
}

.dropdown {
	display: none;
	position: fixed;
	background-color: rgb(30, 0, 255);
}

.dropdown>* {
	margin: 5px;
}
</style>
