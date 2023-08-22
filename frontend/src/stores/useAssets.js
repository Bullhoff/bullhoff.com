import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import _ from 'lodash';
import * as store from '@stores/store.js';

const assetsicons = import.meta.glob('@assets/icons/*.*');
const assetsfonts = import.meta.glob('@assets/fonts/*.*');

function log() {
	if (window.Console) Console.log({ file: 'useAssets.js' }, ...arguments)
	return
}


export default defineStore('assets', () => {
	const assets = ref({ icons: {}, fonts: { [store.useStyle().styles.body.fontFamily]: null, 'Times New Roman': null, serif: null, 'sans-serif': null, monospace: null, cursive: null, fantasy: null } });
	function addFont(font, fontFamily, set = false) {
		if (!fontFamily) fontFamily = font.replaceAll(`.`, ``);
		let exists = fontExists(fontFamily);
		log('fontExists', exists, fontFamily);
		if (assets.value.fonts[font] != null && !exists) {
			let url = `fonts/${font}`;
			const fontFace = new FontFace(fontFamily, `url('${url}')`);
			document.fonts.add(fontFace);
		}
		if (set) store.useStyle().setFont(fontFamily);
		return fontFamily;
	}
	function fontExists(fontFamily) {
		let fontExists = false;
		document.fonts.forEach((font) => {
			if (font.family === fontFamily) fontExists = true;
		});
		return fontExists;
	}

	async function loadAssetFolder(asset) {
		for (const [key, value] of Object.entries(asset)) {
			let k = key.split('/');
			let name = k.pop();
			let val = await value();
			assets.value[k.pop()][name] = val.default;
		}
	}

	async function getAsset(icon, type = 'icons') {
		let assetsPath = `/src/assets`
		let path = `${assetsPath}/${type}/${icon}`
		if (!assetsicons[path]) return '-'
		let val = await assetsicons[path]()
		return val.default
	}



	return {
		getAsset,
		assets,
		addFont,
		loadAssetFolder,
	};
});
