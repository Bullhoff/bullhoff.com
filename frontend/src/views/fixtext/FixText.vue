<style scoped lang="scss">
::-webkit-scrollbar {
	width: 8px;
}

.container {
	display: grid;
	grid-template-columns: fit-content(40ch) auto;
	height: 100%;
	top: 0;
	bottom: 0;
}

.message-board {
	background-color: transparent;
	position: fixed;
	left: 40%;
}

.message {
	visibility: visible;
	display: flex;
	flex-direction: column;
	border: 1px solid blue;
	border-radius: 1ch;
	padding: 5px;
	animation-duration: 0.3s;
	animation-name: fadein;
	animation-iteration-count: 1;
}

.hide {
	animation-duration: 0.7s;
	animation-name: fadeout;
	animation-iteration-count: 1;
}

@keyframes fadein {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

@keyframes fadeout {
	from {
		transform: translateY(0%);
		opacity: 1;
	}

	to {
		transform: translateY(-200%);
		opacity: 0;
	}
}

.select-replace {
	width: 8ch;
	text-overflow: ellipsis;
}

#sidemenu {
	padding: 2px;
	width: 300px;
	height: 100%;
	overflow: auto;
	resize: horizontal;
}

.sidemenu-group {
	border: 1px solid chocolate;
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	white-space: nowrap;
	overflow: hidden;
	padding: 3px;
	margin: 5px 3px 5px 3px;
	min-height: fit-content;
}

.sidemenu-group-active {
	background-color: rgba(155, 65, 0, 0.367);
}

.sidemenu-group-inactive {
	background-color: rgba(95, 95, 95, 0.705);
}

.sidemenu-row {
	display: flex;
	flex-direction: row;
	overflow: hidden;
	align-items: baseline;
	justify-items: baseline;
	vertical-align: middle;
}

.settings-menu {
	display: flex;
	flex-direction: column;
	height: fit-content;
}

.settings-menu label {
	height: 100%;
}

.settings-menu input {
	vertical-align: middle;
	text-align: center;
}

.button-arrow {
	cursor: pointer;
	margin: 0 3px 0 1px;
}

.button-arrow u {
	padding: 0 4px 0 0;
	font-style: italic;
}


.textarea-controls {
	background-color: transparent;
	display: flex;
	flex-direction: row;
	position: absolute;
	right: 0;
}

.textarea-controls p {
	padding: 2px 5px;
	background-color: transparent;
}
</style>

<template>
	<div class="container">
		<div id="messageBoard" class="message-board" :ref="(el) => refs.messageBoard = el"></div>

		<div id="sidemenu" :refs="(el) => refs.sidemenu = el" onresize="func.onResize()">
			<div :class="['sidemenu-group', (menu.showSettings) ? 'sidemenu-group-active' : 'sidemenu-group-inactive']">
				<button @click="menu.showSettings = !menu.showSettings" :style="[(menu.showSettings) ? { 'background-color': 'green' } : {}]">Settings</button>
				<div v-if="menu.showSettings" class="settings-menu">
					<!-- <button @click="func.localstorageClear()" style="width: fit-content">Clear localstorage</button> -->
					<!-- <label><input type="checkbox" :checked="settings.saveToUrl" @click="settings.saveToUrl=$event.target.checked;func.setUrl();" title="Saves everything except input and output to the url" />Save to url</label> -->
					<!--  <label><input type="checkbox" :checked="settings.saveToLocalStorage"
                            @click="settings.saveToLocalStorage = $event.target.checked; func.saveSetToLocalStorage();"
                            title="Saves everything except input and output to localstorage" />Save to localstorage</label> -->
					<label><input type="checkbox" :checked="settings.showImportExport" @click="settings.showImportExport = $event.target.checked; func.save();" />show Import/Export</label>
					<label><input type="checkbox" :checked="settings.enableTabInTextArea" @click="settings.enableTabInTextArea = $event.target.checked; func.save();" />Enable tab in textarea</label>
					<label><input type="checkbox" :checked="settings.autoFormatOnChanges" @click="settings.autoFormatOnChanges = $event.target.checked; func.save();" />Auto format on changes</label>
					<label><input type="checkbox" :checked="settings.inputFillWidth" @click="settings.inputFillWidth = $event.target.checked; func.save();" />inputFillWidth</label>
					<label><input type="checkbox" :checked="settings.showReplaceModeLeft" @click="settings.showReplaceModeLeft = $event.target.checked; func.save();" />showReplaceModeLeft</label>
					<label><input type="checkbox" :checked="settings.showReplaceModeRight" @click="settings.showReplaceModeRight = $event.target.checked; func.save();" />showReplaceModeRight</label>
					<label><input type="checkbox" :checked="settings.showReplaceAfterModeLeft" @click="settings.showReplaceAfterModeLeft = $event.target.checked; func.save();" />showReplaceAfterModeLeft</label>
					<label><input type="checkbox" :checked="settings.showReplaceAfterModeRight" @click="settings.showReplaceAfterModeRight = $event.target.checked; func.save();" />showReplaceAfterModeRight</label>
					<label><input type="checkbox" :checked="settings.showDelimiterMode" @click="settings.showDelimiterMode = $event.target.checked; func.save();" />showDelimiterMode</label>
					<label><input type="checkbox" :checked="settings.loadExamples" @click="settings.loadExamples = $event.target.checked; func.save();" />Load examples on startup</label>
				</div>
			</div>

			<!-- ADD SET -->
			<div :class="['sidemenu-group', (menu.showSets) ? 'sidemenu-group-active' : 'sidemenu-group-inactive']">
				<div>
					<span class="button-arrow" @click="menu.showSets = !menu.showSets">{{ (menu.showSets) ?
						icons.arrowMenuHide
						:
						icons.arrowMenuShow }} <u>SETS / EXAMPLES</u></span>
					<button @click="func.removeSet">-</button>
					<button @click="func.addSet">+</button>
				</div>
				<div v-if="menu.showSets" v-for="(value, i) in sets" style="white-space: nowrap">
					<button @click="func.removeSet(i)">{{ icons.remove }}</button>
					<button @click="sets[i].state.editTitle = !sets[i]?.state?.editTitle" :style="(sets[i]?.state?.editTitle) ? { backgroundColor: 'green' } : {}" :title="sets[i].state.editTitle">{{ icons.edit }}</button>
					<label :title="value.title">
						<input :name="'sets'" type="radio" :id="i" :value="settings.selected" @click="settings.selected = i; fixInput();" :checked="i == settings.selected" />
						<span v-if="!sets[i].state.editTitle">{{ value.title }}</span>
					</label>
					<span v-if="sets[i].state.editTitle" contenteditable="true" style="background-color: yellow" @blur="func.updateSetTitle($event, i)">{{ value.title }}</span>
				</div>
			</div>

			<template v-if="sets[settings.selected]">
				<div class="sidemenu-group">
					<button v-if="!settings.autoFormatOnChanges" @click="fixInput(true)" style="width: fit-content">Format</button>
					<label v-for="(value, key) in sets[settings.selected].options">
						<input name="options" type="checkbox" :id="key" :value="sets[settings.selected].options[key]" @click="sets[settings.selected].options[key] = $event.target.checked; fixInput();" :checked="sets[settings.selected].options[key]" />
						{{ key }}
					</label>
				</div>

				<template v-if="sets[settings.selected].options['Replace text']">
					<!-- REPLACE -->
					<div :class="['sidemenu-group', (menu.showReplace) ? 'sidemenu-group-active' : 'sidemenu-group-inactive']">
						<div>
							<span class="button-arrow" @click="menu.showReplace = !menu.showReplace">{{ (menu.showReplace) ?
								icons.arrowMenuHide : icons.arrowMenuShow }}<u>REPLACE</u></span>
							<button @click="func.removeReplace">-</button>
							<button @click="func.addReplace">+</button>
						</div>
						<span v-if="menu.showReplace" v-for="(replaceValue, replaceKey) in sets[settings.selected].replace">
							<label>
								<input type="checkbox" :id="replaceKey" :value="sets[settings.selected].replace[replaceKey].checked" :checked="sets[settings.selected].replace[replaceKey].checked" @click="sets[settings.selected].replace[replaceKey].checked = $event.target.checked; fixInput(false, 'Replace.text.checkbox');" />
							</label>

							<div style="display: inline-flex; flex-direction: row; padding: 0 0 0 3px">
								<select v-if="settings.showReplaceModeLeft" class="select-replace" @change="sets[settings.selected].replace[replaceKey].modeLeft = $event.target.value; fixInput();" :value="sets[settings.selected].replace[replaceKey].modeLeft" :title="sets[settings.selected].replace[replaceKey].modeLeft + '. ' + modeTooltip[sets[settings.selected].replace[replaceKey].modeLeft]">
									<option value="default" :title="modeTooltip['default']">Default</option>
									<option value="raw" :title="modeTooltip['raw']">Raw</option>
									<option value="codepoints" :title="modeTooltip['codepoints']">CodePoints</option>
									<option value="regex" :title="modeTooltip['regex']">Regex</option>
								</select>
								<input type="text" v-model="sets[settings.selected].replace[replaceKey].from" style="width: 5ch; text-align: center" @change="fixInput(false, 'Replace.text.left');" :style="[(settings.inputFillWidth) ? { width: '100%' } : {}]" />
								<p style="padding: 0 3px 0 3px; cursor: pointer" @click="sets[settings.selected].replace[replaceKey].rightToLeft = !sets[settings.selected].replace[replaceKey].rightToLeft; fixInput();">
									{{ (sets[settings.selected].replace[replaceKey].rightToLeft) ? icons.arrowReplaceLeft :
										icons.arrowReplaceRight }}
								</p>
								<select v-if="settings.showReplaceModeRight" class="select-replace" @change="sets[settings.selected].replace[replaceKey].modeRight = $event.target.value; fixInput();" :value="sets[settings.selected].replace[replaceKey].modeRight" :title="sets[settings.selected].replace[replaceKey].modeRight + '. ' + modeTooltip[sets[settings.selected].replace[replaceKey].modeRight]">
									<option value="default" :title="modeTooltip['default']">Default</option>
									<option value="raw" :title="modeTooltip['raw']">Raw</option>
									<option value="codepoints" :title="modeTooltip['codepoints']">CodePoints</option>
									<option value="regex" :title="modeTooltip['regex']">Regex</option>
								</select>
								<input type="text" v-model="sets[settings.selected].replace[replaceKey].to" style="width: 5ch; text-align: center" @change="fixInput(false, 'Replace.text.right');" :style="[(settings.inputFillWidth) ? { width: '100%' } : {}]" />
							</div>
						</span>
					</div>
				</template>

				<template v-if="sets[settings.selected].options['Output to array']">
					<!-- REPLACEAFTERSTRINGIFY-->
					<div :class="['sidemenu-group', (menu.showReplaceAfterStringify) ? 'sidemenu-group-active' : 'sidemenu-group-inactive']">
						<div style="white-space: nowrap">
							<span class="button-arrow" @click="menu.showReplaceAfterStringify = !menu.showReplaceAfterStringify">{{
								(menu.showReplaceAfterStringify) ?
								icons.arrowMenuHide : icons.arrowMenuShow }}<u>REPLACE AFTER STRINGIFY</u></span>
							<button @click="func.removeReplaceAfterStringify">-</button>
							<button @click="func.addReplaceAfterStringify">+</button>
						</div>
						<span v-if="menu.showReplaceAfterStringify" v-for="(replaceValue, replaceKey) in sets[settings.selected].replaceAfterStringify">
							<label>
								<input type="checkbox" :id="replaceKey" :value="sets[settings.selected].replaceAfterStringify[replaceKey].checked" :checked="sets[settings.selected].replaceAfterStringify[replaceKey].checked" @click="sets[settings.selected].replaceAfterStringify[replaceKey].checked = $event.target.checked; fixInput();" />
							</label>

							<div style="display: inline-flex; flex-direction: row; padding: 0 0 0 3px">
								<select v-if="settings.showReplaceAfterModeLeft" class="select-replace" @change="sets[settings.selected].replaceAfterStringify[replaceKey].modeLeft = $event.target.value; fixInput();" :value="sets[settings.selected].replaceAfterStringify[replaceKey].modeLeft" :title="sets[settings.selected].replaceAfterStringify[replaceKey].modeLeft + '. ' + modeTooltip[sets[settings.selected].replaceAfterStringify[replaceKey].modeLeft]">
									<option value="default" :title="modeTooltip['default']">Default</option>
									<option value="raw" :title="modeTooltip['raw']">Raw</option>
									<option value="codepoints" :title="modeTooltip['codepoints']">CodePoints</option>
									<option value="regex" :title="modeTooltip['regex']">Regex</option>
								</select>
								<input type="text" v-model="sets[settings.selected].replaceAfterStringify[replaceKey].from" style="width: 5ch; text-align: center" @change="fixInput();" :style="[(settings.inputFillWidth) ? { width: '100%' } : {}]" />
								<p style="padding: 0 3px 0 3px; cursor: pointer" @click="sets[settings.selected].replaceAfterStringify[replaceKey].rightToLeft = !sets[settings.selected].replaceAfterStringify[replaceKey].rightToLeft; fixInput();">
									{{ (sets[settings.selected].replaceAfterStringify[replaceKey].rightToLeft) ?
										icons.arrowReplaceLeft : icons.arrowReplaceRight }}
								</p>
								<select v-if="settings.showReplaceAfterModeRight" class="select-replace" @change="sets[settings.selected].replaceAfterStringify[replaceKey].modeRight = $event.target.value; fixInput();" :value="sets[settings.selected].replaceAfterStringify[replaceKey].modeRight" :title="sets[settings.selected].replaceAfterStringify[replaceKey].modeRight + '. ' + modeTooltip[sets[settings.selected].replaceAfterStringify[replaceKey].modeRight]">
									<option value="default" :title="modeTooltip['default']">Default</option>
									<option value="raw" :title="modeTooltip['raw']">Raw</option>
									<option value="codepoints" :title="modeTooltip['codepoints']">CodePoints</option>
									<option value="regex" :title="modeTooltip['regex']">Regex</option>
								</select>
								<input type="text" v-model="sets[settings.selected].replaceAfterStringify[replaceKey].to" style="width: 5ch; text-align: center" @change="fixInput();" :style="[(settings.inputFillWidth) ? { width: '100%' } : {}]" />
							</div>
						</span>
					</div>

					<!-- OUTPUTFORMAT -->
					<div :class="['sidemenu-group', (menu.showOutputformat) ? 'sidemenu-group-active' : 'sidemenu-group-inactive']">
						<div>
							<span class="button-arrow" @click="menu.showOutputformat = !menu.showOutputformat">{{
								(menu.showOutputformat) ?
								icons.arrowMenuHide : icons.arrowMenuShow }}<u>ARRAY OUTPUT SETTINGS</u></span>
						</div>
						<template v-if="menu.showOutputformat">
							<label>
								<input type="checkbox" :value="sets[settings.selected].ignoreEmpty" :checked="sets[settings.selected].ignoreEmpty" @click="sets[settings.selected].ignoreEmpty = $event.target.checked; fixInput();" />
								ignoreEmpty
							</label>
							<label>
								<input type="checkbox" :value="sets[settings.selected].trim" :checked="sets[settings.selected].trim" @click="sets[settings.selected].trim = $event.target.checked; fixInput();" />
								trim
							</label>
							<label>
								<input type="checkbox" :value="sets[settings.selected].beautify" :checked="sets[settings.selected].beautify" @click="sets[settings.selected].beautify = $event.target.checked; fixInput();" />
								beautify
							</label>
						</template>
					</div>

					<!-- ADD DELIMITER -->
					<div :class="['sidemenu-group', (menu.showDelimiters) ? 'sidemenu-group-active' : 'sidemenu-group-inactive']">
						<div>
							<span class="button-arrow" @click="menu.showDelimiters = !menu.showDelimiters">{{
								(menu.showDelimiters) ? icons.arrowMenuHide :
								icons.arrowMenuShow }}<u>DELIMITERS</u></span>
							<button @click="func.removeDelimiter">-</button>
							<button @click="func.addDelimiter">+</button>
						</div>

						<div v-if="menu.showDelimiters" v-for="(value, key) in sets[settings.selected].delimiters" style="display: flex; flex-direction: column; overflow: hidden; align-items: baseline">
							<div v-for="(delimiterPart, i) in value.values" class="sidemenu-row" style="display: flex; flex-direction: row; width: 100%">
								<input type="checkbox" style="vertical-align: middle" :id="key" :value="value.checked" :checked="value.checked" @click="value.checked = $event.target.checked; fixInput();" :style="(i == 0) ? { visibility: 'visible' } : { visibility: 'hidden' }" />
								<select v-if="settings.showDelimiterMode" style="width: 10ch" @change="delimiterPart.mode = $event.target.value; fixInput();" :value="delimiterPart.mode">
									<option value="default" :title="modeTooltip['default']">Default</option>
									<option value="raw" :title="modeTooltip['raw']">Raw</option>
									<option value="codepoints" :title="modeTooltip['codepoints']">CodePoints</option>
									<option value="regex" :title="modeTooltip['regex']">Regex</option>
								</select>
								<input v-model="delimiterPart.value" :style="[(settings.inputFillWidth) ? { width: '100%' } : {}]" @change="fixInput();" />
								<button @click="func.addExtraDelimiter(key)">+</button>
								<button @click="func.removeExtraDelimiter(key)">-</button>
							</div>
						</div>
					</div>
				</template>
			</template>
		</div>

		<!-- TEXTAREAS -->
		<div style="display: grid; grid-auto-flow: row" v-if="sets[settings.selected]">
			<div v-if="settings.showImportExport">
				<button @click="settings.showImportExport = !settings.showImportExport" :style="[(settings.showImportExport) ? { 'background-color': 'green' } : {}]">Hide</button>
				<button @click="func.import()">import</button>
				<button @click="func.exportCurrentSetup()">Export current set ({{ sets[settings.selected].title }})</button>
				<div style="width: 100%; height: 90%">
					<div style="position: absolute; right: 0">
						<button @click="refs.textareaImport.value = '';">Clear</button>
						<button @click="func.copyToClipboard('importexport')">Copy</button>
						<button @click="func.pasteClipboard('importexport')" v-if="menu.browser != 'firefox'">Paste</button>
					</div>
					<textarea :placeholder="`Alternatives: \n*Press '*Export current set' to export the current set setup to this area. \n*Press import to add the set setup entered here. `" spellcheck="false" withspellcheck="false" style="width: 100%; height: 100%" :ref="(el) => (refs.textareaImport = el)" @keydown="func.keydown"></textarea>
				</div>
			</div>
			<div>
				<div class="textarea-controls">
					<p title="Word count">{{ sets[settings.selected].in.split(/[ \n]+/).length }}</p>
					<p title="Character count">{{ sets[settings.selected].in.length }}</p>
					<button @click="sets[settings.selected].in = ''; fixInput();">Clear</button>
					<button @click="func.copyToClipboard('textareaIn')">Copy</button>
					<button @click="func.pasteClipboard('textareaIn')" v-if="menu.browser != 'firefox'">Paste</button>
				</div>
				<textarea placeholder="Input" spellcheck="false" withspellcheck="false" style="width: 100%; height: 100%" :ref="(el) => (refs.textareaIn = el)" v-model="sets[settings.selected].in" @keydown="func.keydown"></textarea>
			</div>
			<div>
				<div class="textarea-controls">
					<p title="Word count">{{ sets[settings.selected].out.split(/[ \n]+/).length }}</p>
					<p title="Character count">{{ sets[settings.selected].out.length }}</p>
					<button @click="sets[settings.selected].out = '';">Clear</button>
					<button @click="func.copyToClipboard('textareaOut')">Copy</button>
					<button @click="func.pasteClipboard('textareaOut')" v-if="menu.browser != 'firefox'">Paste</button>
				</div>
				<textarea placeholder="Output" spellcheck="false" withspellcheck="false" style="width: 100%; height: 100%" :ref="(el) => (refs.textareaOut = el)" v-model="sets[settings.selected].out" @keydown="func.keydown"> </textarea>
			</div>
		</div>
	</div>
</template>

<script setup >
import { useStore, useConfig } from '@stores/store.js'
import _ from 'lodash'
import icons from '@assets/unicodesymbols.js'
import testData from '@assets/testdata_fixtext.js'
const store = useStore()
const refs = reactive({ container: null, messageBoard: null, sidemenu: null });
const menu = reactive({
	browser: '',
	showSettings: false,
	showSets: true,
	showReplace: true,
	showReplaceAfterStringify: false,
	showOutputformat: true,
	showDelimiters: true,
});
if (navigator.userAgent.indexOf('Chrome') != -1) menu.browser = 'chrome';
else if (navigator.userAgent.indexOf('Firefox')) menu.browser = 'firefox';

console.log('browser', menu.browser, navigator.userAgent);

const state = reactive({
	insideIframe: false,
});
const settings = reactive({
	enableTabInTextArea: true,
	saveToLocalStorage: true,
	saveToUrl: false,
	showImportExport: false,
	autoFormatOnChanges: true,
	inputFillWidth: false,
	showReplaceModeLeft: false,
	showReplaceModeRight: false,
	showReplaceAfterModeLeft: true,
	showReplaceAfterModeRight: true,
	showDelimiterMode: true,
	loadExamples: true,
	selected: 'DefaultSet',
});

onBeforeMount(() => {

})

function onResize() {
	try {
		//let rect = refStore().sideMenu.getBoundingClientRect();
	} catch { }
}

onMounted(async () => {
	store.isReady('fixtext', init);
});
async function init() {
	load();
	let interval = setInterval(() => {
		let sidemenu = document.getElementById('sidemenu');
		if (sidemenu) {
			new ResizeObserver(onResize).observe(sidemenu);
			clearInterval(interval);
		}
	}, 1000);
}
function load() {
	if (useStore().fixtext.settings) _.merge(settings, useStore().fixtext.settings);
	if (useStore().fixtext.sets) _.merge(sets, useStore().fixtext.sets);

	if (settings.loadExamples && Object.keys(sets).length < 3) setExamples();
	else for (const [key, value] of Object.entries(sets)) if (testData[key] && value.in == '') sets[key].in = testData[key];
}
function save(msg) {
	if (!settings.saveToUrl && !settings.saveToLocalStorage) return;
	let dataToSave = {
		settings: settings,
		sets: {},
	};

	for (const [dataKey, dataValue] of Object.entries(sets)) {
		dataToSave.sets[dataKey] = Object.entries(dataValue).reduce((a, [key, value]) => {
			if (key == 'input' || key == 'out' || key == 'in') a[key] = '';
			else if (key == 'state') a[key] = {};
			else a[key] = value;
			return a;
		}, {});
	}
	_.merge(useStore().fixtext, dataToSave)
	useConfig().save('fixtext', useStore().fixtext);
}


const getDefaultSetState = () => {
	return { editTitle: false };
};
const getDefaultDelimiter = () => {
	return { checked: false, values: [{ checked: false, mode: 'default', value: String.raw`` }] };
};
const newSet = (obj = {}) => {
	let defaultObj = {
		state: getDefaultSetState(),
		title: 'Title',
		in: ``,
		out: ``,
		ignoreEmpty: true,
		trim: true,
		beautify: true,
		options: {
			'Replace text': true,
			'Output to array': false,
		},
		replace: [
			{ from: '\\\\', to: '/', checked: false, modeLeft: 'default', modeRight: 'default' },
			{ from: '\\', to: '/', checked: false, modeLeft: 'default', modeRight: 'default' },
			{ from: '/', to: '\\', checked: false, modeLeft: 'default', modeRight: 'default' },
			{ from: '\\', to: '\\\\', checked: false, modeLeft: 'default', modeRight: 'default' },
			{ from: ',', to: '.', checked: false, modeLeft: 'default', modeRight: 'default' },
			{ from: '.', to: ',', checked: false, modeLeft: 'default', modeRight: 'default' },
			{ from: ' ', to: '', checked: false, modeLeft: 'default', modeRight: 'default' },
		],
		replaceAfterStringify: [{ from: '\\n', to: '', checked: true, modeLeft: 'raw', modeRight: 'raw' }],
		delimiters: [{ mode: 'default', checked: false, values: [{ checked: false, mode: 'default', value: String.raw`\n` }] }],
	};
	_.merge(defaultObj, obj);
	return defaultObj;
};
const sets = reactive({
	['DefaultSet']: newSet({ title: 'DefaultSet' }),
});


function setExamples() {
	sets['DefaultSet'] = newSet({ title: 'DefaultSet', in: `` });
	sets['Example1'] = newSet({
		title: 'Example1 - Replace text',
		in: testData.Example1,
		options: { 'Replace text': true, 'Output to array': false },
		replace: [
			{ from: ',', to: '', checked: true, modeLeft: 'default', modeRight: 'default' },
			{ from: '.', to: ',', checked: true, modeLeft: 'default', modeRight: 'default' },
		],
		delimiters: [],
	});
	sets['Example2'] = newSet({
		title: 'Example2 - Replace text and Output to array',
		in: testData.Example2,
		options: { 'Replace text': true, 'Output to array': true },
		replace: [
			{ from: '\\\\', to: '/', checked: true, modeLeft: 'default', modeRight: 'default' },
			{ from: '\\', to: '/', checked: true, modeLeft: 'default', modeRight: 'default' },
			{ from: 'pizza', to: '\uD83C\uDF55', checked: true, modeLeft: 'default', modeRight: 'default' },
		],
		replaceAfterStringify: [{ from: '\\n', to: '', checked: true, modeLeft: 'raw', modeRight: 'default' }],
		delimiters: [{ mode: 'default', checked: true, values: [{ mode: 'default', value: String.raw`;` }] }],
	});
	sets['Example3'] = newSet({
		title: 'Example3 - Table',
		in: testData.Example3,
		options: { 'Replace text': true, 'Output to array': true },
		delimiters: [
			{ mode: 'default', checked: true, values: [{ mode: 'default', value: String.raw`\n` }] },
			{ mode: 'default', checked: true, values: [{ mode: 'default', value: String.raw`|` }] },
		],
	});
	sets['Example4'] = newSet({
		title: 'Example4 - Table',
		in: testData.Example4,
		options: { 'Replace text': true, 'Output to array': true },
		delimiters: [
			{ mode: 'default', checked: true, values: [{ mode: 'default', value: String.raw`\n` }] },
			{ mode: 'default', checked: true, values: [{ mode: 'default', value: String.raw`-` }] },
		],
	});
	sets['Example5'] = newSet({
		title: 'Example5 - Table',
		in: testData.Example5,
		options: { 'Replace text': true, 'Output to array': true },
		delimiters: [
			{ mode: 'default', checked: true, values: [{ mode: 'default', value: String.raw`\n` }] },
			{ mode: 'default', checked: true, values: [{ mode: 'default', value: String.raw`\t` }] },
		],
	});
	sets['Example6'] = newSet({
		title: 'Example6 - Table',
		in: testData.Example6,
		beautify: false,
		options: { 'Replace text': true, 'Output to array': true },
		replace: [
			{ from: 'U[+]([A-Z0-9]*)(x)', to: '', checked: true, modeLeft: 'regex', modeRight: 'default' },
			{ from: '[0-9A-Z]*', to: '', checked: false, modeLeft: 'regex', modeRight: 'default' },
			{ from: ' ', to: '', checked: false, modeLeft: 'default', modeRight: 'default' },
			{ from: String.raw`\n`, to: '', checked: false, modeLeft: 'default', modeRight: 'default' },
			{ from: String.raw`\t`, to: '', checked: false, modeLeft: 'default', modeRight: 'default' },
		],
		delimiters: [
			{
				checked: true,
				values: [
					{ mode: 'default', value: String.raw`\n` },
					{ mode: 'default', value: String.raw`\t` },
				],
			},
		],
	});
}

watch(
	() => sets[settings.selected]?.in,
	() => {
		performTextConversion();
	}
);
const textEq = {
	'\\r': { delimiter: '\r', info: `\\r \t\t\u27F6\u{2003} Carriage Return` },
	'\\n': { delimiter: '\n', info: `\\n \t\t\u27F6\u{2003} Line Feed (New line)` },
	'\\r\\n': { delimiter: '\r\n', info: `\\r\\n \t\u27F6\u{2003} End of line` },
	'\\t': { delimiter: '\t', info: `\\t \t\t\u27F6\u{2003} Tab` },
};
const modeTooltip = computed(() => ({
	default:
		'What you type is what you get, except:\n' +
		Object.values(textEq)
			.map((x) => x.info)
			.join('\n'),
	raw: 'What you type is what you get, for example:\n\\n' + icons.space + icons.arrowRight + icons.space + '\\n',
	codepoints: 'Separate with comma, for example CR LF is typed:\n0x0D,0x0A',
}));

function setDelimiter(delimiterSelected, delimiter) {
	if (delimiterSelected == 'codepoints') {
		let codepoints = delimiter.split(',').map((x) => parseInt(x)); // , 16
		delimiter = String.fromCodePoint(...codepoints);
	} else if (delimiterSelected == 'default') {
		if (delimiter == String.raw`\r`) delimiter = '\r';
		if (delimiter == String.raw`\n`) delimiter = '\n';
		if (delimiter == String.raw`\r\n`) delimiter = '\r\n';
		if (delimiter == String.raw`\t`) delimiter = '\t';
	} else if (delimiterSelected == 'regex') {
		delimiter = new RegExp(delimiter, 'g');
	}
	return delimiter;
}

function toArray(res, delimiters, i = 0, set) {
	if (!res || !delimiters || !delimiters[i]) return res;

	let delimiter = delimiters[i];
	i++;
	if (!delimiter?.checked) {
		return toArray(res, delimiters, i);
	}
	for (let y = 0; y < res.length; y++) {
		for (let x = 0; x < delimiter.values.length; x++) {
			let delim = setDelimiter(delimiter.values[x].mode, delimiter.values[x].value);
			if (typeof res == 'string') res = res.split(delim);

			if (res[y]) {
				if (typeof res[y] == 'object') {
					//res[y] = toArray(res[y], delimiters, i);
				} else {
					let splitted = res[y].split(delim);
					res.splice(y, 1, ...splitted);
				}
			}
			if (y > 1000 || i > 1000) break;
		}
	}
	for (let y = 0; y < res.length; y++) {
		if (set?.trim && res[y]) res[y] = res[y].trim();
		if (set?.ignoreEmpty && res[y] == '') {
			res.splice(y, 1);
			y--;
		}
		res[y] = toArray(res[y], delimiters, i, set);
	}
	return res;
}

function fixInput(formatButtonClicked = false) {
	save('fixInput');
	performTextConversion(formatButtonClicked);
}

function performTextConversion(formatButtonClicked = false) {
	if (!formatButtonClicked && !settings.autoFormatOnChanges) return;
	let set = sets[settings.selected];
	let res = set?.in;
	if (!set) return;
	if (set.options['Replace text'] && set.replace)
		for (const [key, value] of Object.entries(set.replace)) {
			try {
				let left = setDelimiter(value.modeLeft, value.from);
				let right = setDelimiter(value.modeRight, value.to);
				if (value.checked && value.rightToLeft) res = res.replaceAll(right, left);
				else if (value.checked && !value.rightToLeft) res = res.replaceAll(left, right);
			} catch (err) {
				console.log('err', err);
			}
		}

	if (set.options['Output to array'] && res) {
		res = toArray(res, set.delimiters, 0, set);
		if (set.beautify) res = JSON.stringify(res, null, 2);
		else res = JSON.stringify(res);

		for (let i = 0; i < set.replaceAfterStringify.length; i++) {
			try {
				let left = setDelimiter(set.replaceAfterStringify[i]?.modeLeft, set.replaceAfterStringify[i]?.from);
				let right = setDelimiter(set.replaceAfterStringify[i]?.modeRight, set.replaceAfterStringify[i]?.to);
				if (set.replaceAfterStringify[i]?.checked && set.replaceAfterStringify[i]?.rightToLeft) res = res.replaceAll(right, left);
				if (set.replaceAfterStringify[i]?.checked && !set.replaceAfterStringify[i]?.rightToLeft) res = res.replaceAll(left, right);
			} catch { }
		}
	}
	set.out = res;
	return;
}

const func = {
	save: () => {
		save('save');
	},
	addSet: () => {
		sets[crypto.randomUUID()] = newSet();
		save('addSet');
	},
	removeDelimiter: () => {
		if (sets[settings.selected]) sets[settings.selected].delimiters.pop();
		save('removeDelimiter');
	},
	addDelimiter: () => {
		if (sets[settings.selected]) sets[settings.selected].delimiters.push(getDefaultDelimiter());
		console.log('addDelimiter', sets[settings.selected]);
		save('addDelimiter');
	},
	addExtraDelimiter: (i) => {
		sets[settings.selected].delimiters[i].values.push({ mode: 'default', value: String.raw`` });
		save('addExtraDelimiter');
	},
	removeExtraDelimiter: (i) => {
		sets[settings.selected].delimiters[i].values.pop();
		fixInput();
		save('removeExtraDelimiter');
	},
	removeReplace: () => {
		sets[settings.selected].replace.pop();
		fixInput();
		save('removeReplace');
	},
	addReplace: () => {
		sets[settings.selected].replace.push({ from: '', to: '', checked: false, modeLeft: 'default', modeRight: 'default' });
		save('addReplace');
	},
	removeReplaceAfterStringify: () => {
		sets[settings.selected].replaceAfterStringify.pop();
		fixInput();
		save('removeReplaceAfterStringify');
	},

	addReplaceAfterStringify: () => {
		sets[settings.selected].replaceAfterStringify.push({ from: '', to: '', checked: false, modeLeft: 'raw', modeRight: 'default' });
		save('addReplaceAfterStringify');
	},
	import: () => {
		let text = refs.textareaImport.value;
		try {
			text = JSON.parse(text);
			let set = newSet();
			Object.assign(set, text);
			sets[crypto.randomUUID()] = set;
		} catch (err) {
			postError('Invalid json');
		}
		save('import');
	},
	exportCurrentSetup: (e) => {
		if (sets[settings.selected]) refs.textareaImport.value = JSON.stringify(sets[settings.selected]);
	},
	onResize: (e) => {
		console.log('resize');
	},
	localstorageClear: (e) => {
		window.localStorage.clear();
	},
	saveSetToLocalStorage: (value, key) => {
		let sets = localStorage.getItem('sets');
		if (sets) sets = JSON.parse(sets);
		if (!sets) sets = {};
		sets[key] = value;
		localStorage.setItem('sets', JSON.stringify(sets));
		save('saveSetToLocalStorage');
	},
	keydown(e) {
		if (e.key == 'Tab' && settings.enableTabInTextArea && e.target) {
			e.preventDefault();
			var start = e.target.selectionStart;
			var end = e.target.selectionEnd;
			e.target.value = e.target.value.substring(0, start) + '\t' + e.target.value.substring(end);
			e.target.selectionStart = e.target.selectionEnd = start + 1;
		}
	},
	async pasteClipboard(opt, el) {
		if (!el && refs[opt]) el = refs[opt];
		navigator.clipboard.readText().then((clipText) => (el.value = clipText));
	},
	selectAll(opt, el) {
		if (!el && refs[opt]) el = refs[opt];
		el.select();
		el.setSelectionRange(0, 99999);
	},
	copyToClipboard(opt, el) {
		if (!el && refs[opt]) el = refs[opt];
		try {
			el.select();
			el.setSelectionRange(0, 99999);
			navigator.clipboard.writeText(el.value);
			postMessage(`${el.value.toString().length} characters added to clipboard`);
		} catch (err) {
			postError('error');
		}
	},
	setUrl() {
		if (!settings.saveToUrl) {
			history.pushState({}, '', new URL(location).pathname);
			saveToUrl({ settings: { saveToUrl: settings.saveToUrl } });
		} else save('setUrl');
	},
	removeSet(id) {
		if (settings.selected == id) {
			settings.selected = '';
		}
		delete sets[id];
		save('removeSet');
	},
	updateSetTitle(e, setid) {
		sets[setid].title = e.target.innerText;
		save('updateSetTitle');
	},
};
function postError(text = 'Error', color = 'red', time = 5000) {
	postMessage(text, color, time);
}
function postMessage(text = 'Message', color = 'chocolate', time = 5000) {
	let div = document.createElement('div');
	div.classList.add('message');
	div.style.backgroundColor = color;
	div.innerHTML = text;
	document.getElementById('messageBoard').appendChild(div);
	setTimeout(() => {
		div.classList.add('hide');
		div.addEventListener(
			'webkitAnimationEnd',
			() => {
				div.remove();
			},
			false
		);
	}, time);
}




function saveToUrl(dataToSave) {
	const url = new URL(location);
	dataToSave = encodeURIComponent(JSON.stringify(dataToSave));
	url.searchParams.set('', dataToSave);
	history.pushState({}, '', url);
}
function getDataFromUrl() {
	const url = new URL(location);
	let data = url.searchParams.get('');
	if (data) data = decodeURIComponent(data);
	if (data) data = JSON.parse(data);
	return data;
}
</script>