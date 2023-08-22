//import './style.css';

import * as stopwatch from './stopwatch.js';
const iid = 'instance-' + Math.round(Math.random() * 1000)//Date.now();
var title = {
	default: '\u23F1 Stopwatch',
	element: false,
};

var tickerInterval;
export var stopwatches = {};
console.log(' JS ');

var elStopwatches = {};
var settings = {
	saveToUrl: false,
	saveToLocalStorage: true,
	updateFrequency: 1000,
	columns: {
		//save: {gridColumn: 'fit-content(1ch)', show: true, order: 1},
		setWindowTitle: { gridColumn: 'fit-content(1ch)', show: true, order: 2 },
		remove: { gridColumn: 'fit-content(1ch)', show: true, order: 3 },
		reset: { gridColumn: 'fit-content(1ch)', show: true, order: 4 },
		startstop: { gridColumn: 'fit-content(1ch)', show: true, order: 5 },

		days: { gridColumn: 'fit-content(0ch)', show: true, order: 6 },
		hours: { gridColumn: 'fit-content(1ch)', show: true, order: 7 },
		minutes: { gridColumn: 'fit-content(1ch)', show: true, order: 8 },
		seconds: { gridColumn: 'fit-content(1ch)', show: true, order: 9 },
		time: { gridColumn: 'fit-content(5ch)', show: false, order: 10 },
		ms: { gridColumn: 'fit-content(0ch)', show: false, order: 11 },
		title: { gridColumn: 'fit-content(100%)', show: true, order: 12 },
	},
};

export class StopwatchContainer {
	constructor({ parent = document.body, container, toObj = {} } = {}) {
		//this.parent = parent;
		this.toObj = toObj
		this.container = parent;
		this.controlsContainer = createContainer(this.container, { id: 'additionalControlsContainer' + iid, style: { display: 'flex', 'flex-direction': 'row' } });
		this.stopwatchContainer = createContainer(this.container, { id: 'stopwatch_container' + iid, style: { display: 'grid', gridTemplateColumns: getGridTemplateColumns(), lineHeight: '1' } });
		this.init();
	}
	save() {
		if (settings.saveToLocalStorage) localStorage.setItem('stopwatches', JSON.stringify(stopwatches));
		else localStorage.clear();
		this.toObj = stopwatches
	}
	init() {
		this.createControls();
		this.initStopwatches();
		//this.parent.appendChild(this.container);
	}
	createControls() {
		createButton(this.controlsContainer, {
			//id: 'stopwatch_add',
			textContent: 'Add Stopwatch',
			style: {},
			onClick: (e) => {
				let uuid = getUUID();
				stopwatches[uuid] = new stopwatch.Stopwatch({ createdAt: uuid, running: true });
				createStopWatchHtml(uuid, this.stopwatchContainer);
				this.save();;
			},
		});
		let el = createElement(this.controlsContainer, 'input', { id: 'stopwatch_updateFrequency' + iid, value: settings.updateFrequency, type: 'number', step: '100', min: '0', style: { width: '7ch' } });
		el.addEventListener('change', (e) => {
			console.log('stopwatch_updateFrequency', iid);
			settings.updateFrequency = e.target.value;
			tickerInterval = clearInterval(tickerInterval);
			this.ticker();
			this.save();;
		});
	}

	initStopwatches() {
		let stopwatchesStorage = localStorage.getItem('stopwatches');

		if (!stopwatchesStorage) {
			let uuid = getUUID();
			stopwatches[uuid] = new stopwatch.Stopwatch({ createdAt: uuid, running: true });
			createStopWatchHtml(uuid, this.stopwatchContainer);
		} else {
			if (stopwatchesStorage) Object.assign(stopwatches, JSON.parse(stopwatchesStorage));
			for (const [key, value] of Object.entries(stopwatches)) {
				if (!key || !value) continue;
				if (value.setAsWindowTitle && !title.element) title.element = key;
				stopwatches[key] = new stopwatch.Stopwatch(value);
				createStopWatchHtml(key, this.stopwatchContainer);
			}
		}
		this.ticker();
		this.save();;
	}

	ticker() {
		if (!tickerInterval)
			tickerInterval = setInterval(() => {
				for (const [key, value] of Object.entries(stopwatches)) {
					if (!document.getElementById(key + '_seconds' + iid)) break
					let cols = settings.columns;
					let obj = value.getElapsedTimeFormatted('object'); // {days, hours, minutes, seconds, ms}

					if (obj.hours > 0) {
						document.getElementById(key + '_hours' + iid).innerText = `${obj.hours}`;
						if (cols.hours.show && (cols.minutes.show || (!cols.minutes.show && cols.seconds.show) || (!cols.minutes.show && !cols.seconds.show && cols.ms.show))) document.getElementById(key + '_hours' + iid).innerText += `:`;
					}
					if (obj.minutes > 0 || obj.hours) {
						document.getElementById(key + '_minutes' + iid).innerText = `${obj.minutes}`;
						if (cols.minutes.show && (cols.seconds.show || (!cols.seconds.show && cols.ms.show))) document.getElementById(key + '_minutes' + iid).innerText += `:`;
					}
					document.getElementById(key + '_seconds' + iid).innerText = `${obj.seconds}`;
					if (cols.seconds.show && cols.ms.show) document.getElementById(key + '_seconds' + iid).innerText += `:`;
					document.getElementById(key + '_ms' + iid).innerText = `${obj.ms}`;
					if (obj.days > 0) document.getElementById(key + '_days' + iid).innerText = `${obj.days}`;

					let arr = Object.entries(obj).reduce((a, [key, value]) => {
						if (settings.columns[key].show && (value > 0 || a.length != 0)) a.push(value);
						return a;
					}, []);
					let str = arr.join(':');
					document.getElementById(key + iid).innerText = str;
					if (value.setAsWindowTitle) {
						document.title = str;
					}
				}
			}, settings.updateFrequency);
	}
}

function getGridTemplateColumns() {
	return Object.entries(settings.columns).reduce((a, [key, value]) => {
		if (value.show) a += ' ' + value.gridColumn;
		return a;
	}, '');
}

/* function this.save(); {
	if (settings.saveToLocalStorage) localStorage.setItem('stopwatches', JSON.stringify(stopwatches));
	else {
		localStorage.clear();
	}
} */
function getUUID() {
	return 'sw-' + Date.parse(new Date()) + '-' + Math.round(Math.random() * 100);
}

function createElement(parent, element, obj = {}) {
	//let o = {style: {}}
	let el = document.createElement(element);
	//Object.assign(o,obj)
	Object.assign(el, obj);
	if (obj.style) Object.assign(el.style, obj.style);
	if (parent) parent.appendChild(el);
	return el;
}

function createButton(parent, obj = {}) {
	let o = {
		//parent: null,
		element: 'button',
		type: null,
		id: null,
		textContent: null,
		text: null,
		value: null,
		onClick: null,
		onChange: null,
		step: null,
		min: null,
		max: null,
		style: {
			display: 'block',
			//display: 'grid',
			//gridTemplateColumns: 'repeat(auto-fill, fit-content(1ch))',
			alignItems: 'baseline',
			verticalAlign: 'middle',
			lineHeight: '16px',
		},
	};
	o = Object.assign(o, obj);
	let container = document.createElement(o.element);
	if (o.onClick) container.addEventListener('click', o.onClick);
	if (o.onChange) container.addEventListener('change', o.onChange);
	if (o.type) container.type = o.type;
	if (o.id) container.id = o.id;
	if (o.textContent) container.textContent = o.textContent;
	if (o.text) container.text = o.text;
	if (o.value) container.value = o.value;
	Object.assign(container.style, o.style);
	if (parent) parent.appendChild(container);
	return container;
}

function createContainer(parent, obj = {}) {
	let o = {
		//parent: null,
		element: 'div',
		id: null,
		style: {
			display: 'block',
			alignItems: 'baseline',
			verticalAlign: 'middle',
			lineHeight: '16px',
		},
	};
	o = Object.assign(o, obj);
	let container = document.createElement(o.element);
	if (o.id) container.id = o.id;
	Object.assign(container.style, o.style);
	if (parent) parent.appendChild(container);
	return container;
}

function hideshowColumn(boolish, el) {
	if (boolish == true || boolish == 'block') {
		el.style.display = 'block';
	} else {
		el.style.display = 'none';
	}
}

function createStopWatchHtml(uuid, container) {
	//let container = document.getElementById('stopwatchcontainer');

	elStopwatches[uuid] = {};

	/////   SET AS PAGE TITLE
	elStopwatches[uuid].setWindowTitle = createElement(container, 'button', { title: 'Set windowtitle to duration', id: 'buttonpagetitle_' + uuid + iid, textContent: String.fromCodePoint(0x1f441), style: {} });
	if (stopwatches[uuid].setAsWindowTitle) elStopwatches[uuid].setWindowTitle.style.backgroundColor = 'green';
	else elStopwatches[uuid].setWindowTitle.style.backgroundColor = 'transparent';
	elStopwatches[uuid].setWindowTitle.addEventListener('click', () => {
		stopwatches[uuid].setAsWindowTitle = !stopwatches[uuid].setAsWindowTitle;
		if (stopwatches[uuid].setAsWindowTitle) {
			elStopwatches[uuid].setWindowTitle.style.backgroundColor = 'green';
			if (title.element) {
				stopwatches[title.element].setAsWindowTitle = false;
				document.getElementById('buttonpagetitle_' + title.element + iid).style.backgroundColor = 'transparent';
			}
			title.element = uuid;
		} else {
			title.element = false;
			elStopwatches[uuid].setWindowTitle.style.backgroundColor = 'transparent';
			document.title = title.default;
		}
		//this.save();;
	});


	/////   REMOVE
	elStopwatches[uuid].remove = createElement(container, 'button', { title: 'Remove stopwatch', textContent: String.fromCodePoint(0x1f5d1), style: {} });
	elStopwatches[uuid].remove.addEventListener('click', () => {
		for (const [key, value] of Object.entries(elStopwatches[uuid])) {
			elStopwatches[uuid][key].remove();
		}
		delete stopwatches[uuid];
		//this.save();;
	});

	/////   RESET
	elStopwatches[uuid].reset = createElement(container, 'button', { title: 'Reset stopwatch', textContent: String.fromCodePoint(0x2b6e), style: {} });
	elStopwatches[uuid].reset.addEventListener('click', () => {
		stopwatches[uuid].reset();
		setButton(elStopwatches[uuid].startstop, stopwatches[uuid].running);
		//this.save();;
	});

	/////   START/STOP
	elStopwatches[uuid].startstop = createElement(container, 'button', { title: 'Reset stopwatch', textContent: '', style: { margin: '0 5px 0 0' } });
	elStopwatches[uuid].startstop.addEventListener('click', () => {
		stopwatches[uuid].toggle();
		setButton(elStopwatches[uuid].startstop, stopwatches[uuid].running);
	});
	setButton(elStopwatches[uuid].startstop, stopwatches[uuid].running);

	/////   DAYS
	elStopwatches[uuid].days = createElement(container, 'span', { id: uuid + '_days' + iid, style: { padding: '0 7px 0 3px', 'align-self': 'center' } });
	hideshowColumn(settings.columns.days.show, elStopwatches[uuid].days);

	/////   HOURS
	elStopwatches[uuid].hours = createElement(container, 'span', { id: uuid + '_hours' + iid, style: { 'align-self': 'center' } });

	/////   MINUTES
	elStopwatches[uuid].minutes = createElement(container, 'span', { id: uuid + '_minutes' + iid, style: { 'align-self': 'center' } });

	/////   SECONDS
	elStopwatches[uuid].seconds = createElement(container, 'span', { id: uuid + '_seconds' + iid, style: { 'align-self': 'center' } });



	/////   MS
	elStopwatches[uuid].ms = createElement(container, 'span', { id: uuid + '_ms' + iid, style: { 'align-self': 'center' } });
	hideshowColumn(settings.columns.ms.show, elStopwatches[uuid].ms);

	/////   TIME
	elStopwatches[uuid].time = createElement(container, 'span', { id: uuid + '' + iid, innerHTML: '00:00:00', style: { 'align-self': 'center', padding: '0 8px', 'text-align': 'right' } });
	hideshowColumn(settings.columns.time.show, elStopwatches[uuid].time);


	/////   TITLE
	elStopwatches[uuid].title = createElement(container, 'span', {
		id: uuid + '_title' + iid, spellcheck: false, withspellcheck: false, contentEditable: true, innerHTML: stopwatches[uuid].title ? stopwatches[uuid].title : '', style: {
			'align-self': 'center', padding: '0 8px', 'text-align': 'left', 'width': '100%', 'minWidth': '15ch', 'borderBottom': '1px dashed gray', 'margin': '0 9px',
		}
	});
	elStopwatches[uuid].title.addEventListener('blur', (e) => {
		stopwatches[uuid].title = e.target.innerText;
		//this.save();;
	});


	//container.appendChild(elSave);
	/* container.appendChild(buttonPageTitle);
	container.appendChild(buttonRemove);
	container.appendChild(buttonReset);
	container.appendChild(buttonStartStop);
	container.appendChild(spanDays);
	// spanHours, spanMinutes, spanSeconds     uuid+'_hours', uuid+'_minutes', uuid+'_seconds'
	container.appendChild(spanHours);
	container.appendChild(spanMinutes);
	container.appendChild(spanSeconds);
	container.appendChild(spanMs);
	container.appendChild(spanTime);
	container.appendChild(inputTitle); */
}

function setButton(el, running) {
	//console.log('setButton', running)
	if (running) {
		el.textContent = String.fromCodePoint(0x23f8); //'Stop';
		el.style.backgroundColor = 'red';
	} else {
		el.textContent = String.fromCodePoint(0x23f5); //'Start';
		el.style.backgroundColor = 'green';
	}
	//this.save();;
}

/* function notifyMe() {
	if (!('Notification' in window)) {
		alert('This browser does not support desktop notification');
	} else if (Notification.permission === 'granted') {
		const notification = new Notification('Hi there!1');
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				const notification = new Notification('Hi there!2');

			    
			}
		});
	}
	setTimeout(()=>{
		const img = "./../assets/pizza/icon64.png";
		const text = `HEY! Your task "${'title'}" is now overdue.`;
		const notification = new Notification("To do list", { body: text, icon: img });
	}, 10000)
    
} */

/* 
npm install --save-dev html-webpack-plugin

*/
