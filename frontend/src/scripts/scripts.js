
import Url from './url.js'
export { Url, }

export function generateID() {
	let guid = '';
	const hexChars = 'abcdefghijklmnopqrst';
	for (let i = 0; i < 10; i++) {
		const randomIndex = Math.floor(Math.random() * hexChars.length);
		guid += hexChars[randomIndex];
	}
	guid += '_' + Date.now() //Date.parse()
	return guid;
}
export function generateGUID() {
	let guid = '';
	const hexChars = 'abcdefghijklmnopqrst';
	for (let i = 0; i < 32; i++) {
		const randomIndex = Math.floor(Math.random() * hexChars.length);
		guid += hexChars[randomIndex];
	}
	return guid;
}
export function generateGUID2() {
	const s4 = () =>
		Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function assignGUID(el) {
	if (!el.id) {
		el.id = generateGUID();
	}
}
export function capitalize(str) {
	if (str == null) return '';
	if (typeof str != 'string') str = toString(str);
	return str[0].toUpperCase() + str.substr(1);
}

export function parse(value) {
	try {
		return JSON.parse(value);
	} catch (err) {
		console.log('parseerror', value);
		return {};
	}
}
function mergeStorage() {
	const localData = { ...localStorage };
	const sessionData = { ...sessionStorage };
	return _.merge(localData, sessionData);
	return { ...localData, ...sessionData };
}

export function sort(obj, key) {
	try {
		return Object.fromEntries(Object.entries(obj).sort((a, b) => parseInt(a[1][key]) - parseInt(b[1][key])));
	} catch (err) {
		return null;
	}
	//return Object.fromEntries(Object.entries(obj).sort((a, b) => a[1].getElapsedTime() - b[1].getElapsedTime()))
}

const fullmoonNr = (N) => 20.362954 + 29.5305888531 * N + 102.19 * Math.pow(10, -12) * Math.pow(N, 2);
export function getFullmoons({ from = 0, to = 500 } = {}) {
	//for (let i = from; i < to; i++) {}
	return Array.from(Array(to - from), (_, index) => index + from).map((i) => addDays(new Date('01 Jan 2000 00:00:00 UTC'), fullmoonNr(i)));
	return Array.from(Array(to - from), (_, index) => index + from).map((i) => fullmoonNr(i));
}
function addDays(date, days) {
	date.setDate(date.getDate() + days);
	return date;
}

// let morsdag = lastSunday(dateTime.getFullYear(), 5);
function lastSundayOfTheMonth(year, month) {
	var date = new Date(year, month, 1, 12);
	let weekday = date.getDay();
	let dayDiff = weekday === 0 ? 7 : weekday;
	let lastSunday = date.setDate(date.getDate() - dayDiff);
	return date; //date.toDateString();
}


export const usrlang = () => navigator.language || navigator.userLanguage;
//console.log("User's preferred language is: " + usrlang);


export const getBrowserInfo = () => {
	let device = 'computer'
	let browser
	if (navigator.userAgent.indexOf('Chrome') != -1) browser = 'chrome';
	else if (navigator.userAgent.indexOf('Firefox')) browser = 'firefox';

	return {}
}