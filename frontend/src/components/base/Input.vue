<style scoped>
* {
	box-sizing: border-box;
	margin: 0;
}
</style>

<template>
	<div :style="[style.container, typeof props.style == 'string' ? props.style : '']" :ref="(el) => (refs.container = el)">
		<input :type="props.type" v-model="inputValue" :ref="(el) => (refs.hidden = el)" :style="[style.hidden, props.useOriginal ? { visibility: 'none' } : { visibility: 'hidden' }]" />
		<template v-if="!props.useOriginal">
			<p :ref="(el) => (refs.inputValue = el)" :style="[state.invalid ? style.invalid : {}, style.input]" @keydown="keyDown($event)" @keyup="keyUp($event)" @blur="onBlur($event)" contenteditable="true" spellcheck="false">
				{{ inputValue }}
			</p>
			<span :style="style.button" v-if="showButton && !props.buttonImage" @click="onClick($event)" :ref="(el) => (refs.button = el)">{{ typeObj.buttonText }}</span>
			<img v-else-if="showButton && props.buttonImage" :src="props.buttonImage" alt="" :style="[style.button, style.buttonImage]" @click="onClick($event)" :ref="(el) => (refs.button = el)" />
		</template>
	</div>
</template>

<script setup>
//import _ from 'lodash';
import { ref, reactive, nextTick, onMounted, watch } from 'vue';

const toStr = {
	//time: (d = new Date()) => `${d.toLocaleTimeString('se')}`,
	//date: (d = new Date()) => `${d.toLocaleDateString(`se`, {year: `numeric`, month: `2-digit`, day: `2-digit`})}`,
	time: (d = new Date()) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`,
	date: (d = new Date()) => `${d.getFullYear().toString()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`,
};
const validate = {
	time: (str) => {
		if (!str) return toStr.time();
		const timeRegex = /^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?$/;
		const match = str.match(timeRegex);
		if (!match && state.lastValidValue) return state.lastValidValue;
		else if (!match) {
			return toStr.time();
		}
		let h = parseInt(match[1]);
		let m = match[2] ? parseInt(match[2]) : 0;
		let s = match[3] ? parseInt(match[3]) : 0;
		if (h > 23) h = 23;
		if (m > 59) m = 59;
		if (s > 59) s = 59;
		let res = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
		state.lastValidValue = res;
		return res;
	},
	date: (str) => {
		if (!str) return toStr.date();
		const dateRegex = /^(\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/;
		const match = str.match(dateRegex);
		if (!match && state.lastValidValue) return state.lastValidValue;
		else if (!match) return toStr.date();
		if (!match) return false;
		let year = parseInt(match[1]);
		let month = match[2] ? parseInt(match[2]) : 0;
		let day = match[3] ? parseInt(match[3]) : 0;

		if (year > 3000) year = 2999;
		if (month > 12) month = 12;
		else if (!month) month = 1;
		let days = new Date(year, month, 0).getDate();
		if (day > days) day = days;
		else if (!day) day = 1;

		// Adds appropriate amount of years if less than 4 numbers are entered
		if (year < 10) year += 10;
		if (year < 1000 && year < 50) year += 2000;
		else if (year < 1000 && year >= 50) year += 1900;
		year = year.toString();

		let res = `${year.padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; // year.toString().padStart(4, '0')
		state.lastValidValue = res;
		return res;
	},
};
// [Boolean, String]	[String, Date]
const emit = defineEmits(['onClick', 'onChange', 'onBlur']);
const props = defineProps({
	emitOnlyValid: { type: Boolean, required: false, default: true },
	emitValue: { type: String, required: false, default: 'onlyvalue' },

	useOriginal: { type: Boolean, required: false, default: false },
	buttonImage: { type: String, required: false, default: null },

	type: { type: String, required: false, default: 'text' },
	value: { type: [String, Date], required: false, default: '' },
	showButton: { type: [String, null, Boolean], required: false, default: null },
	//width: {type: String, required: false, default: null},
	//checked: {default: true},
	style: { type: [Object, String], required: false, default: {} },
	styles: { type: Object, required: false, default: {} },
});
const style = reactive({});
const refs = reactive({ date: null, time: null, inputValue: null, container: null });
const state = reactive({
	lastValidValue: null,
	invalid: false,
	logCount: 0,
	logColor: '#' + (Math.floor(Math.random() * 16777214) + 1).toString(16).padStart(6, '0'), // '#' + Math.floor(Math.random()*16777215).toString(16)
});
const types = {
	time: {
		validCharacters: '1234567890:',
		showButton: true,
		buttonText: String.fromCodePoint(0x1f551),
		//characters: 6 + 2,
		//widths: '10ch',
	},
	date: {
		validCharacters: '1234567890-',
		showButton: true,
		buttonText: String.fromCodePoint(0x1f4c5),
		//characters: 8 + 2,
		//widths: '12ch',
	},
	week: {},
	color: {},
	file: {},
	range: {},
	image: {},
	checkbox: {},
};
const typeObj = types[props.type];
const showButton = props.showButton != null ? props.showButton : typeObj.showButton;

const inputValue = ref(props.value);
watch(
	() => props.value,
	(newValue, oldValue) => {
		log('watch props.value', inputValue.value);
		inputValue.value = props.value;
	},
	{ immediate: true }
);
const defaultStyles = {
	container: {
		color: 'rgba(220,220,220,1)', // inherit
		'background-color': 'rgba(55,55,55,0.5)',
		'text-shadow': '1px 1px 1px teal',
		'line-height': 1.6,
		display: 'inline-flex',
		position: 'relative',
		'font-family': 'monospace',
		//height: '100%',
		width: 'fit-content',
		'max-width': '100%',
		'white-space': 'nowrap',
		overflow: 'hidden',
		'align-items': 'center', 	// center, stretch
		//'align-content': 'center',	// center, start
		border: '1px solid gray',
		'border-radius': '0.3ch',
		gap: '0.5ch',
		padding: '0 0.5ch',
	},
	input: {
		position: 'relative',
		display: 'block',
		'font-size': 'inherit',
		width: 'fit-content',
		outline: '0px solid transparent',
	},
	button: {
		display: 'block',
		position: 'relative',
		border: 'none',
		cursor: 'pointer',
		'background-color': 'transparent',
	},
	buttonImage: {
		height: `${1}em`, //height:`${1*1.3}em`,	`${1*getComputedStyle(refs.container).lineHeight}em`
		'max-height': '100%',
		'object-fit': 'contain',
		'object-position': '50% 50%', // center,  50% 50%
	},
	hidden: { position: 'absolute' },
	invalid: { 'background-color': 'red' },
};

function log() {
	if (true) return;
	state.logCount++;
	console.log(`%c${props.type} ${state.logCount}`, `color: ${state.logColor}`, ...arguments);
}
function setStyle() {
	Object.assign(style, defaultStyles);
	Object.assign(style, props.styles);
	style.buttonImage.height = `${style.container['line-height'] ? parseFloat(style.container['line-height']) : 1}em`;
	if (typeof props.style == 'object') Object.assign(style.container, props.style);
}
onMounted(() => {
	if (inputValue.value == '') inputValue.value = toStr[props.type]();
	if (typeof inputValue.value == Date) inputValue.value = toStr[props.type](inputValue.value);
	setStyle();
});

watch(
	inputValue,
	(val, oldVal) => {
		log(`********watch.inputValue***********`, val, oldVal);
		if (!val || !oldVal || val == oldVal) {
			state.okToSend = false;
			return;
		}
		state.okToSend = true;
		log(`********watch.inputValue state.okToSend***********`, state.okToSend, val, oldVal);
		/* if (!val) return;
		if (val == oldVal) return;
		if(!oldVal) return */
		let res = validate[props.type](val);
		if (res) state.invalid = false;
		else state.invalid = true;
		if (!state.invalid) emitHandler({ eventType: 'onChange', e: null });
	},
	{ immediate: true }
);

function emitHandler({ e, eventType } = {}) {
	if (!state.okToSend) return
	if (props.emitOnlyValid && state.invalid) return;
	if (props.emitValue == 'onlyvalue') emit(eventType, inputValue.value);
	else {
		let obj = {};
		obj.e = e;
		obj.eventType = eventType;
		obj.invalid = state.invalid;
		obj.inputValue = inputValue.value;
		obj.value = inputValue.value;
		emit(eventType, obj);
	}
}

const keyDownFunctions = {
	time: (e, pos) => {
		let direction = e.key == 'ArrowUp' ? +1 : -1;
		let [h, m, s] = inputValue.value.split(':').map((x) => parseInt(x));
		let part = pos <= 2 ? 'hours' : pos <= 5 ? 'minutes' : pos <= 8 ? 'seconds' : false;
		if (part == 'seconds') s += direction;
		if (s > 59) s = 0;
		else if (s < 0) s = 59;
		if (part == 'minutes') m += direction;
		if (m > 59) m = 0;
		else if (m < 0) m = 59;
		if (part == 'hours') h += direction;
		if (h > 23) h = 0;
		else if (h < 0) h = 23;
		elF.setText(e, `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
	},
	date: (e, pos) => {
		let direction = e.key == 'ArrowUp' ? +1 : -1;
		let date = new Date(Date.parse(inputValue.value));
		let part = pos <= 4 ? 'FullYear' : pos <= 7 ? 'Month' : pos <= 10 ? 'Date' : false;
		date['set' + part](date['get' + part]() + direction);
		//if (part == 'FullYear') date.setFullYear(date.getFullYear() + direction);
		//if (part == 'Month') date.setMonth(date.getMonth() + direction);
		//if (part == 'Date') date.setDate(date.getDate() + direction);
		elF.setText(e, toStr[props.type](date));
	},
};
async function keyDown(e) {
	if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
		e.preventDefault();
		let text = await elF.getText(e);
		text = await validate[props.type](text);
		if (!text) return;
		await elF.setText(e, text);
		let pos = await elF.getPos(); //refs.inputValue.selectionStart;
		await keyDownFunctions[props.type](e, pos);
		await nextTick();
		await elF.setPos(pos);
	} else if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
	} else if (e.key == 'Enter') {
		e.preventDefault();
	} else if (e.key && e.key.length == 1) {
		if (!typeObj.validCharacters.includes(e.key)) e.preventDefault();
	}
	log('keydown', e.key);
}
async function keyUp(e) {
	//if (e.key && e.key.length == 1) {}
}
const elFunctions = {
	input: {
		getPos: () => {
			return refs.inputValue.selectionStart;
		},
		setPos: () => {
			refs.inputValue.focus();
			refs.inputValue.setSelectionRange(pos, pos);
		},
		getText: (e) => {
			return inputValue.value;
		},
		setText: (e, text) => {
			inputValue.value = text;
		},
	},
	contenteditable: {
		getPos: () => {
			const selection = window.getSelection();
			const cursorPosition = selection.anchorOffset;
			return cursorPosition;
		},
		setPos: (pos, start = refs.inputValue.firstChild, end) => {
			if (!end) end = start;
			var range = document.createRange();
			range.setStart(start, pos);
			range.setEnd(end, pos);
			var selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
		},
		getText: (e) => {
			return e.target.innerText;
		},
		setText: (e, text) => {
			inputValue.value = text;
			//e.target.innerText = text
		},
	},
};
const element = 'contenteditable';
const elF = elFunctions[element];

function onBlur(e) {
	//return
	let text = elF.getText(e); //e.target.innerText //inputValue.value;
	log('onBlur1', text);
	text = validate[props.type](text);
	log('onBlur2', text);
	if (!text) text = toStr[[props.type]]();
	log('onBlur3', text);
	elF.setText(e, text);
	e.target.innerText = text;
	emitHandler({ eventType: 'onBlur', e });
}
function onClick(e) {
	refs.hidden.showPicker();
	emitHandler({ eventType: 'onClick', e });
}
</script>
