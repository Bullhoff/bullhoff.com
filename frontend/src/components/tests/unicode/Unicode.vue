<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, reactive } from 'vue';
import pizzapng from '@assets/pizza/icon32.png';
//import ansijson from '@assets/ansi.json'
//import dashJson from '@assets/unicode_Pd_dash.json'

//import {useStore, useNextCloud, useConfig} from '@stores/store.js';
//import {SvgBin} from './SvgIcons.vue';
const refs = reactive({});
const state = reactive({});
const props = defineProps({});

//watch(() => props.value,(newValue, oldValue) => {},{immediate: true});
//watch(state,(newValue, oldValue) => {console.log(`watch`, {...oldValue}, {...newValue});},{deep: true, immediate: true});
//watch(inputValueRo, (value) => {});

const infoList = [
	[
		"Character code",
		"Type",
		"ASCII",
		"Windows-1252",
		"ISO-8859-1"
	],
	[
		"0 - 31",
		"Control characters",
		"YES",
		"YES",
		"YES"
	],
	[
		"32 - 126",
		"Printable characters",
		"YES",
		"YES",
		"YES"
	],
	[
		"127",
		"Control characters",
		"YES",
		"YES",
		"YES"
	],
	[
		"128 - 159",
		"Printable characters",
		"NO",
		"YES",
		"NO(only as control characters)"
	],
	[
		"160 - 255",
		"Printable characters",
		"NO",
		"YES",
		"YES"
	]
]
const dashList = [
	[
		"Mark",
		"Name",
		"Code point",
		"General Category",
		"Script"
	],
	[
		"-",
		"HYPHEN-MINUS",
		"U+002D",
		"Pd, dash",
		"Common"
	],
	[
		"‐",
		"HYPHEN",
		"U+2010",
		"Pd, dash",
		"Common"
	],
	[
		"‑",
		"NON-BREAKING HYPHEN",
		"U+2011",
		"Pd, dash",
		"Common"
	],
	[
		"‒",
		"FIGURE DASH",
		"U+2012",
		"Pd, dash",
		"Common"
	],
	[
		"–",
		"EN DASH",
		"U+2013",
		"Pd, dash",
		"Common"
	],
	[
		"—",
		"EM DASH",
		"U+2014",
		"Pd, dash",
		"Common"
	],
	[
		"―",
		"HORIZONTAL BAR",
		"U+2015",
		"Pd, dash",
		"Common"
	],
	[
		"⸗",
		"DOUBLE OBLIQUE HYPHEN",
		"U+2E17",
		"Pd, dash",
		"Common"
	],
	[
		"⸚",
		"HYPHEN WITH DIAERESIS",
		"U+2E1A",
		"Pd, dash",
		"Common"
	],
	[
		"⸺",
		"TWO-EM DASH",
		"U+2E3A",
		"Pd, dash",
		"Common"
	],
	[
		"⸻",
		"THREE-EM DASH",
		"U+2E3B",
		"Pd, dash",
		"Common"
	],
	[
		"⹀",
		"DOUBLE HYPHEN",
		"U+2E40",
		"Pd, dash",
		"Common"
	],
	[
		"〜",
		"WAVE DASH",
		"U+301C",
		"Pd, dash",
		"Common"
	],
	[
		"〰",
		"WAVY DASH",
		"U+3030",
		"Pd, dash",
		"Common"
	],
	[
		"゠",
		"KATAKANA-HIRAGANA DOUBLE HYPHEN",
		"U+30A0",
		"Pd, dash",
		"Common"
	],
	[
		"︱",
		"PRESENTATION FORM FOR VERTICAL EM DASH",
		"U+FE31",
		"Pd, dash",
		"Common"
	],
	[
		"︲",
		"PRESENTATION FORM FOR VERTICAL EN DASH",
		"U+FE32",
		"Pd, dash",
		"Common"
	],
	[
		"﹘",
		"SMALL EM DASH",
		"U+FE58",
		"Pd, dash",
		"Common"
	],
	[
		"﹣",
		"SMALL HYPHEN-MINUS",
		"U+FE63",
		"Pd, dash",
		"Common"
	],
	[
		"－",
		"FULLWIDTH HYPHEN-MINUS",
		"U+FF0D",
		"Pd, dash",
		"Common"
	],
	[
		"֊",
		"ARMENIAN HYPHEN",
		"U+058A",
		"Pd, dash",
		"Armenian"
	],
	[
		"᐀",
		"CANADIAN SYLLABICS HYPHEN",
		"U+1400",
		"Pd, dash",
		"Canadian Aboriginal"
	],
	[
		"־",
		"HEBREW PUNCTUATION MAQAF",
		"U+05BE",
		"Pd, dash",
		"Hebrew"
	],
	[
		"᠆",
		"MONGOLIAN TODO SOFT HYPHEN",
		"U+1806",
		"Pd, dash",
		"Mongolian"
	],
	[
		"𐺭",
		"YEZIDI HYPHENATION MARK",
		"U+10EAD",
		"Pd, dash",
		"Yezidi"
	]
]

const sometexts = [
	'-', '-', '2011 - 2011', ' –  2013', '2013 –', '2014 – 2019',
]
const blocks = {
	'Punctuation marks in Unicode': {
		'Dash Punctuation': [0x002D, 0x10EAD],
	},

}

const controlCharacters = {

}


function numbersBetween(from, to) {
	let range = to - from + 1
	let arr = Array.from(Array(range).keys()).map((x) => x + from)
	console.log('numbersBetween', from, to, arr)
	return arr
}

onMounted(() => {
	//console.log('ansijson', ansijson)
});

function decToHex(decimal) {
	if (decimal === 0) return "0";
	let hex = "";
	const hexDigits = "0123456789ABCDEF";
	while (decimal > 0) {
		const remainder = decimal % 16;
		hex = hexDigits.charAt(remainder) + hex;
		decimal = Math.floor(decimal / 16);
	}
	return hex;
}
/* 
https://en.wikipedia.org/wiki/Unicode_character_property#General_Category
https://en.wikipedia.org/wiki/Template:Punctuation_marks_in_Unicode

*/


</script>

<template>
	<div>
		<details>
			<summary><b><u>infoList</u></b></summary>
			<table>
				<tr v-for="(rowObj, i) in infoList">
					<td v-for="(colStr, y) in rowObj">{{ colStr }}</td>
				</tr>
			</table>
		</details>



		<details>
			<summary><b><u>0 - 255</u></b></summary>
			<table>
				<tr v-for="(nr, i) in numbersBetween(0, 255)">
					<td>{{ nr }}</td>
					<td>"{{ String.fromCodePoint(nr) }}"</td>
				</tr>
			</table>
		</details>


		<details>
			<summary><b><u>dashList</u></b></summary>
			<table>
				<tr v-for="(rowObj, i) in dashList">
					<td v-for="(colStr, y) in rowObj">{{ colStr }}</td>
				</tr>
			</table>
		</details>

	</div>
</template>

<style scoped lang="scss">
table {
	border-collapse: collapse;

	tr:first-child {
		font-weight: 900;
		background-color: rgba(93, 39, 0, 0.479);
		border: 1px solid red;
	}

	tr {
		td {
			border: 1px dotted red;
		}
	}
}
</style>
