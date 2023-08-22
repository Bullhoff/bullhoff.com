
import _, { forEach } from 'lodash'
import { useConfig, useStore, useNextCloud } from '@stores/store.js'
import { html_beautify, css_beautify, js_beautify } from 'js-beautify'
import * as templates from './templates/templates.js'
import { toRaw } from 'vue'

const getRandomColor = () => '#' + (Math.floor(Math.random() * 16777214) + 1).toString(16).padStart(6, '0')
var state = {
	logCount: 0,
	logColor: getRandomColor(),
	logSections: {}
}

function log() {
	if (window.Console) Console.log({ file: 'codesandbox', func: arguments[0] }, ...arguments)
	return
	var params = Array.prototype.slice.call(arguments);
	let section = params.shift()
	if (!state.logSections[section]) state.logSections[section] = { color: getRandomColor() }
	state.logCount++;
	console.log(`%c${section} ${state.logCount}`, `color: ${state.logSections[section].color}`, ...params);
}

const templateList = {
	'template1.html': {
		partSelected: `full`,
		parts: {
			'css-base': { lang: 'css', },
			'css': { lang: 'css', },
			'html': { lang: 'html', },
			'js': { lang: 'javascript', },
		},
		//text: template1
	},
	'template2.html': {
		partSelected: `full`,
		parts: {
			//'full': { lang: 'html', },
			//'css-base': { lang: 'css', },
			'css': { lang: 'css', },
			'html': { lang: 'html', },
			'js': { lang: 'javascript', },
		},
		//text: template2
	},
	'with_output.html': {
		partSelected: `main`,
		parts: {
			'main': { lang: 'html', },
			'js': { lang: 'javascript', },
			'html': { lang: 'html', },
			'css': { lang: 'css', },
			'output': { lang: 'javascript', },
		},
		//text: withoutput.replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)
	},
}


export class CodeSandBox {
	constructor({
		controls = {},
		renderOn = { buttonpush: true, 'ctrl+s': true, change: false },
	} = {}) {
		this.theme = `vibrant_ink`
		this.renderOn = renderOn
		this.iframe
		this.editor;
		this.renderButton
		this.rendered = false;

		this.templates = {}
		this.fileList = reactive({})
		this.state = reactive({
			fileSelected: null,	// `template1.html`
			inited: false,
			changedSinceLastSave: false,
			loading: true,
		})
		this.sessions = { full: null, css: null, html: null, javascript: null };
		this.controls = controls
	}
	getLang(id = this.partSelected()) {
		let lang = this.fileList[this.state.fileSelected].parts[id]?.lang
		log('getLang', id, { 'this.partSelected()': this.partSelected(), id, lang })
		return (lang) ? lang : 'html'
	}
	getParts() {
		return this.fileList[this.state.fileSelected].parts
	}
	currentText(file = this.state.fileSelected) {
		if (!this.fileList[file].text && templates[file]) this.fileList[file].text = templates[file]
		return this.fileList[file].text
	}
	currentFile(file = this.state.fileSelected) {
		return this.fileList[file]
	}
	partSelected(file = this.state.fileSelected) {
		return this.fileList[file].partSelected
	}
	getPart(part = this.partSelected()) {
		return this.currentFile().parts[part]
	}
	updateControls(controls = this.controls) {
		this.controls = controls
	}
	async loadTemplates() {
		let start = performance.now()
		for (var key of Object.keys(templates)) {

			let file = key + '.html'
			log('loadTemplates', file, key, this.fileList[file], templates[key], key)
			if (!this.fileList[file]?.text) this.fileList[file].text = templates[key].replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)
		}
		let done = performance.now()
		let time = done - start
		log('PERFORMANCE LOAD TEMPALTE', start, done, time, Math.round(time), Math.round(time) / 1000)
	}
	getDom() {
		this.iframe = document.querySelector('iframe');
		this.renderButton = document.getElementById('render-button');
	}
	async loadEditor() {
		let elEditor = document.getElementById('editor')
		elEditor.style.visibility = 'hidden'
		this.editor = ace.edit('editor');
		this.editor.setTheme(`ace/theme/${this.theme}`);
		setTimeout(() => elEditor.style.visibility = 'visible', 100)	// keep the editor hidden for 100ms to give the theme some time to load
		window.aceEditor = this.editor;
	}
	async init() {
		await this.getDom()
		ace.config.set("basePath", "/ace/src-noconflict");
		await this.loadEditor()

		new GridResizeHandle(document.getElementById('codesandbox-container'), document.getElementById('editor-container'), this.iframe);

		this.editor.setHighlightActiveLine(true);
		this.editor.setShowPrintMargin(true);
		this.editor.setAutoScrollEditorIntoView(true);
		await this.load()

		await this.setSessions()
		this.editor.on('change', (delta) => {
			this.state.changedSinceLastSave = true
			log('codesandbox.change', this.state.changedSinceLastSave)
			if (!this.renderButton) this.getDom()
			this.renderButton.style.backgroundColor = 'green'
			if (this.renderOn.change) this.renderCode();
		});

		let settings_menu = ace.require('ace/ext/settings_menu');
		settings_menu.init();
		this.editor.commands.addCommands([{
			name: 'myCommand',
			bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
			exec: (editor) => {
				if (this.renderOn['ctrl+s']) this.renderCode();
			},
			readOnly: true,
		},
		]);

	}
	async loadFile(key) {
		if (this.fileList[key].text) return useStore().loadingFinished('codesandbox')
		useStore().loadingStart('codesandbox')
		if (useStore().codesandbox.files[key]) this.fileList[key].text = useStore().codesandbox.files[key]
		else {
			this.fileList[key].text = await useNextCloud().loadNextCloudData(`/codesandbox/files/${key}`, '')
			if ((!this.fileList[key].text || this.fileList[key].text == 'File not found') && templateList[key]) this.fileList[key].text = templates[key.replace('.html', '')].replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)
			if (!this.fileList[key].text || this.fileList[key].text == 'File not found') {
				let k = key.replace('.html', '')
				if (templates[k]) this.fileList[key].text = templates[k]
				else this.fileList[key].text = templates.template1
			}
		}
		useStore().loadingFinished('codesandbox')
		if (!this.fileList[key].text) return false

		return true
	}
	getFileListWithoutCode() {
		let filelist = {}
		for (const key in this.fileList) {
			filelist[key] = Object.entries(this.fileList[key]).reduce((a, [key, value]) => {
				if (key != 'text') a[key] = value
				return a
			}, {})
		}
		return filelist
	}
	removeFile(key) {
		log('codesandbox.removeFile', key, `this.state.fileSelected:"${this.state.fileSelected}"`,)

		if (this.state.fileSelected == key) {
			this.state.fileSelected = Object.keys(this.fileList)[0]
			this.changeFile(key)
		}
		log('codesandbox.removeFile', key, `this.state.fileSelected:"${this.state.fileSelected}"`,)
		this.fileList[key].hide = true
		let filelist = this.getFileListWithoutCode()
		log('codesandbox.removeFile', key, `this.state.fileSelected:"${this.state.fileSelected}"`, filelist)
		useConfig().save('codesandbox', { file: null, filelist, code: null })
		useNextCloud().deleteFile('codesandbox', '', `/codesandbox/files/` + key)
	}
	changeFileName(oldKey, newKey) {
		if (oldKey == newKey) return
		log('codesandbox.changeFileName', oldKey, newKey, this.state.fileSelected)
		Object.defineProperty(this.fileList, oldKey, Object.getOwnPropertyDescriptor(this.fileList, newKey));

		if (this.state.fileSelected == oldKey) {
			this.state.fileSelected = newKey
			this.setSessions(this.fileList[this.state.fileSelected])
		}
		delete this.fileList[oldKey];
		let filelist = this.getFileListWithoutCode()
		log('codesandbox.changeFileName', oldKey, newKey, this.state.fileSelected, filelist)
		useConfig().save('codesandbox', { file: newKey, filelist, code: this.fileList[this.state.fileSelected].text })
		useNextCloud().deleteFile('codesandbox', '', `/codesandbox/files/` + oldKey)

	}
	removeSection(key) {
		log('codesandbox.removeSection', key,)
		if (this.fileList[this.state.fileSelected].partSelected == key) this.fileList[this.state.fileSelected].partSelected = Object.keys(this.fileList[this.state.fileSelected].parts[key])[0]
		delete this.fileList[this.state.fileSelected].parts[key]
		let filelist = this.getFileListWithoutCode()
		log('codesandbox.removeSection', key, filelist)
		useConfig().save('codesandbox', { file: null, filelist, code: null })
	}
	changeSectionName(newKey, oldKey) {
		if (oldKey == newKey) return
		log('codesandbox.changeSectionName', newKey, oldKey)
		Object.defineProperty(this.fileList[this.state.fileSelected].part[oldKey], oldKey, Object.getOwnPropertyDescriptor(this.fileList[this.state.fileSelected].part[newKey], newKey));
		if (this.fileList[this.state.fileSelected].partSelected == oldKey) {
			this.fileList[this.state.fileSelected].partSelected = newKey
			this.setSession(newKey)
		}
		delete this.fileList[this.state.fileSelected].part[oldKey];
		let filelist = this.getFileListWithoutCode()
		useConfig().save('codesandbox', { file: null, filelist, code: null })
	}
	changeSectionLang(key, newVal) {
		log('codesandbox.changeSectionLang', key, newVal)
		this.fileList[this.state.fileSelected].parts[key] = newVal
		let filelist = this.getFileListWithoutCode()
		log('codesandbox.changeSectionLang', key, newVal, filelist)
		this.sessions[key].setMode(`ace/mode/${newVal}`)
		useConfig().save('codesandbox', { file: null, filelist, code: null })
	}
	createSession(key, value) {
		let lang = this.getLang(key)//this.fileList[this.state.fileSelected][this.partSelected()].lang
		if (!lang) {
			if (key.includes('javascript')) lang = 'javascript'
			else if (key.includes('css')) lang = 'css'
			else if (key.includes('html')) lang = 'html'
			else lang = 'html'
		}
		this.sessions[key] = ace.createEditSession(value, `ace/mode/${lang}`);
		this.sessions[key].setUseWrapMode(false);
	}
	addPart(id, lang) {
		log('codesandbox.addPart', id, lang)
		if (!id || !lang) return
		let doc = new DOMParser().parseFromString(this.sessions.full.getValue(), 'text/html');
		let el = doc.querySelector(id)
		if (!el) return

		this.fileList[this.state.currentFile].parts[id] = { lang }

		let value = (el?.innerHTML) ? el?.innerHTML : ''
		this.createSession(id, value)
		log('codesandbox.addPart', id, lang, this.fileList[this.state.currentFile].parts)
		this.sessions[key].setMode(`ace/mode/${newVal}`)
		useConfig().save('codesandbox', { file: null, filelist, code: null })
	}

	async load() {
		useStore().loadingStart('codesandbox')
		let data = useStore().codesandbox
		await _.merge(this.fileList, templateList)
		if (!this.state.fileSelected) this.state.fileSelected = Object.keys(this.fileList)[0]
		log('codesandbox.load', this.state.fileSelected)
		if (data.filelist) await _.merge(this.fileList, data.filelist)

		for (const key of Object.keys(templateList)) {
			if (this.fileList[key].hide) {
				delete this.fileList[key]
				if (key == this.state.fileSelected) this.state.fileSelected = Object.keys(this.fileList)[0]
			}
		}
		await this.loadFile(this.state.fileSelected)
		useStore().loadingFinished('codesandbox')
	}
	save() {
		if (!this.state.changedSinceLastSave) return
		this.state.changedSinceLastSave = false
		//return
		this.fileList[this.state.fileSelected].text = this.sessions.full.getValue()
		let file = this.state.fileSelected
		let filelist = this.getFileListWithoutCode()
		useConfig().save('codesandbox', { file, filelist, code: this.fileList[this.state.fileSelected].text })
	}
	newFile(name) {
		useStore().loadingStart('codesandbox')
		log('codesandbox.newFile', name, name)
		if (!name) name = `file${Object.keys(this.fileList).length + 1}.html`
		this.fileList[name] = {
			parts: {
				'css': { lang: 'css', },
				'html': { lang: 'html', },
				'javascript': { lang: 'javascript', },
			},
			text: templates['template1'],
		}
		this.changeFile(name)
		useStore().loadingFinished('codesandbox')
	}
	getAllId(filename = this.state.fileSelected) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(this.fileList[filename].text, 'text/html');
		const allElements = doc.querySelectorAll(`*`)
		allElements.forEach(el => {
			if (el.id) {
				let lang = null
				if (el.closest(`script`)) lang = 'javascript'
				else if (el.closest(`style`)) lang = 'css'
				else lang = 'html'
				this.fileList[filename].parts[el.id] = { lang }
			}
		})
	}
	editTemplate() {
		//template
	}

	changeTheme(key, value) {
		log('changeTheme', key, value)
		this.editor.setTheme(`ace/theme/${key}`);
	}
	setSessions() {
		this.state.inited = false
		this.sessions = {}
		this.createSession('full', this.currentText())
		this.extractBodyElements()	// this.currentText()
		this.setSession(this.fileList[this.state.fileSelected].partSelected)
		this.setButtonColors()
		this.renderCode()
	}
	setSession(id = 'full', e) {
		let partSelected = this.partSelected()
		log('setSession', id, { partSelected, id, })
		if (partSelected != 'full') this.updateFullHtml(partSelected)
		else this.extractBodyElements()
		this.editor.setSession(this.sessions[id]);
		//partSelected = id
		this.fileList[this.state.fileSelected].partSelected = id
		this.autoCorrectIndentation(id)
		this.setButtonColors(e)
	}
	setButtonColors(e) {
		return
		let partSelected = this.partSelected()
		for (const button of document.querySelectorAll('.session-button')) {
			let id = button.textContent.toLowerCase()
			//log('setButtonColors', id, { partSelected, id })
			if (partSelected == id) button.style.backgroundColor = 'green'
			else button.style.backgroundColor = ''
		}
	}
	renderCode = () => {

		let partSelected = this.partSelected()
		if (partSelected != 'full') {
			this.updateFullHtml(partSelected)
		}
		if (this.state.inited) this.save('renderCode')
		this.state.inited = true
		if (!this.iframe) this.getDom()
		var code = this.iframe?.contentWindow?.document;
		if (!code) return;
		code.open();
		code.writeln("");
		code.writeln(this.getFullHtml());
		code.close();
		this.renderButton.style.backgroundColor = ''
		useStore().loadingFinished('codesandbox')
	};
	async changeFile(key, value) {
		useStore().loadingStart('codesandbox')
		log('changeFile', key, 1, this.state.fileSelected, key, { 'this.sessions.full.getValue()': this.sessions.full.getValue(), 'this.sessions.full.getValue().innerHTML': this.sessions.full.getValue().innerHTML, },)
		this.fileList[this.state.fileSelected].text = this.sessions.full.getValue()
		await this.save('changeFile')
		log('changeFile', key, 2, { fileSelected: this.state.fileSelected, key })
		this.state.fileSelected = key
		await this.loadFile(key)
		log('changeFile', key, 4, this.state.fileSelected, key, this.fileList)
		document.getElementById('btn-fileSelected').textContent = key
		this.setSessions()
		useStore().loadingFinished('codesandbox')
	}

	getFullHtml = () => {
		return this.sessions.full.getValue()
	}
	autoCorrectIndentation = (id = this.state.fileSelected) => {
		var code = this.sessions[id].getValue()
		var beautifiedCode
		var lang = this.getLang(id)
		if (id == 'css' || lang == 'css') beautifiedCode = css_beautify(code, { indent_size: 2 });
		else if (id == 'javascript' || lang == 'javascript') beautifiedCode = js_beautify(code, { indent_size: 2 });
		else if (id == 'html' || lang == 'html') beautifiedCode = html_beautify(code, { indent_size: 2 });
		else beautifiedCode = html_beautify(code, { indent_size: 2 });
		this.sessions[id].setValue(beautifiedCode);
	};


	htmlToString() {

	}
	updateFullHtml(key) {
		let fullValue = this.sessions.full.getValue()
		let doc = new DOMParser().parseFromString(fullValue, 'text/html');
		let fullKey = doc.querySelector(`#${key}`)
		if (fullKey) {
			let addVal = this.sessions[key].getValue()
			fullKey.innerHTML = addVal
			this.sessions.full.setValue('<!DOCTYPE html><html lang="en">' + doc.documentElement.innerHTML + `</html>`)	// doc.documentElement.innerHTML
		}
	}
	setFullHtml(full = this.currentText()) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(full, 'text/html');
		for (const [key, value] of Object.entries(this.getParts())) {
			this.sessions.full.querySelector(`#${key}`).innerHTML = this.sessions[key].getValue()
		}
	}

	extractBodyElements() {
		const parser = new DOMParser();
		let full = this.sessions.full.getValue()
		const doc = parser.parseFromString(full, 'text/html');
		for (const [key, value] of Object.entries(this.getParts())) {
			let val = Array.from(doc.querySelectorAll(`#${key}`)).reduce((a, c) => {
				a += c.innerHTML
				return a
			}, ``)
			if (!this.sessions[key]) this.createSession(key, val)
			else this.sessions[key].setValue(val)
		}
	}

}


class GridResizeHandle {
	constructor(parent, leftCol, rightCol, resizeFunction) {
		this.parent = parent;
		this.leftCol = leftCol;
		this.rightCol = rightCol;
		this.resizeFunction = resizeFunction;
		this.handle;
		this.cover;
		this.holding = false;
		this.x;
		this.y;
		this.timelagArr = [];
		this.msDelay = 10;

		this.createCover();
		this.createHandle();
	}
	timelag() {
		this.timelagArr[1] = Date.now();
		if (this.timelagArr[0] && this.timelagArr[1] < this.timelagArr[0] + this.msDelay) return false;
		this.timelagArr[0] = Date.now();
		return true;
	}
	createCover() {
		// To stop iframe from eating the mousemove
		this.cover = document.createElement('span');
		this.cover.style.display = 'none';
		this.cover.style.position = 'fixed';
		this.cover.style.left = 0;
		this.cover.style.top = 0;
		this.cover.style.width = '100%';
		this.cover.style.height = '100%';
		this.cover.style.zIndex = '999';
		this.cover.style.backgroundColor = 'transparent';
		document.body.appendChild(this.cover);
	}
	createHandle() {
		this.handle = document.createElement('div'); // prevent-select       dblclick    click.prevent
		this.handle.style.position = 'sticky';
		let actualHandle = document.createElement('div');
		actualHandle.style.cursor = 'col-resize';
		actualHandle.style.width = '6px';
		actualHandle.style.right = 0;
		actualHandle.style.top = 0;
		actualHandle.style.height = '100%';
		actualHandle.addEventListener('mousedown', this.mousedown);
		this.handle.appendChild(actualHandle);
		this.leftCol.appendChild(this.handle);
	}
	mousedown = (e) => {
		e.stopImmediatePropagation();
		e.stopPropagation();
		e.preventDefault();
		this.cover.style.display = 'block';
		this.x = e.clientX;
		this.y = e.clientY;
		document.body.style.cursor = 'col-resize';
		this.holding = true;
		window.addEventListener('mousemove', this.mousemove);
		window.addEventListener('mouseup', this.mouseup);
		window.addEventListener('mouseleave', this.mouseup);
	};
	mouseup = (e) => {
		this.cover.style.display = 'none';
		document.body.style.cursor = 'auto';
		this.holding = false;
		window.removeEventListener('mousemove', this.mousemove);
		window.removeEventListener('mouseup', this.mouseup);
		window.removeEventListener('mouseleave', this.mouseup);
	};
	mousemove = (e) => {
		let { clientX, clientY } = e;
		let minMovement = 2;
		if (Math.abs(this.x - clientX) < minMovement && Math.abs(this.y - clientY) < minMovement) return;
		if (!this.holding) return;
		if (!this.timelag()) return;

		let columnRect = this.leftCol.getBoundingClientRect();
		var newWidth = Math.round(e.clientX - columnRect.left + 3);
		this.parent.style.gridTemplateColumns = `${newWidth}px 1fr`;

		if (window.aceEditor) window.aceEditor.resize();
	};
	//mouseleave = (e) => {}
}




/* 
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		console.log('EXPORT1', factory);
		// AMD (RequireJS) module
		define([], factory);
	} else if (typeof exports === 'object' && typeof module === 'object') {
		console.log('EXPORT2', factory);
		// CommonJS (Node.js) module
		module.exports = factory();
	} else {
		console.log('EXPORT3', factory);
		// Global variable
		root.CodeSandBox = factory();
	}
});
typeof self !== 'undefined' ? self : this,
	function () {
		console.log('EXPORT4', self);
		var publicAPI = {
			CodeSandBox,
		};

		// Attach publicAPI to the global object
		if (typeof window !== 'undefined') {
			window.CodeSandBox = publicAPI;
		}

		return publicAPI;
	}; 
*/