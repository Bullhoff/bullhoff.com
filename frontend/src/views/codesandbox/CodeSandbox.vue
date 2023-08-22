<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, reactive } from 'vue';
import { useStore, useNextCloud, useConfig, useAssets } from '@stores/store.js';
import { CodeSandBox } from './codesandbox.js'
import Dropdown from '@components/Dropdown.vue'
import 'ace-builds/src-min-noconflict/ace.js'
import 'ace-builds/src-min-noconflict/ext-settings_menu.js'
import 'ace-builds/src-min-noconflict/ext-themelist.js'
const refs = reactive({});
const state = reactive({});
const props = defineProps({});
const container = ref(null)

var themelist = reactive({})
const codesandbox = new CodeSandBox(state);
onMounted(() => {
	useStore().isReady('codesandbox', init);
});
function init() {
	codesandbox.init()
	Object.assign(themelist, ace.require('ace/ext/themelist').themesByName)
}
</script>

<template>
	<div id="codesandbox-container" ref="container" class="codesandbox-container" :style="[(codesandbox.state.fileSelected) ? {} : { visibility: 'hidden' }]">
		<div class="codesandbox-nav-top">
			<ButtonGroup>
				<button @click="codesandbox.editor.showSettingsMenu()">Settings</button>
			</ButtonGroup>

			<ButtonGroup @click="($event) => { }">
				<template v-slot:button>
					<Dropdown>
						<template v-slot:button>
							<button id="btn-fileSelected" class="select-button" :title="codesandbox.state.fileSelected"> <i class="fa fa-angle-down"></i> {{ codesandbox.state.fileSelected }}</button>
						</template>
						<template v-slot:dropdown v-if="codesandbox.state.fileSelected">
							<div style="display:grid;grid-template-columns: auto auto auto;">
								<template v-for="(value, key) in codesandbox.fileList">
									<template v-if="!codesandbox.fileList[key].hide">
										<button @click="codesandbox.changeFile(key, value)">Goto</button>
										<input :value="key" :title="(codesandbox.fileList?.[key]?.parts) ? JSON.stringify(codesandbox.fileList[key].parts) : ''" @change="codesandbox.changeFileName(key, $event.target.value)" />
										<button @click="codesandbox.removeFile(key)">-</button>
									</template>
								</template>
								<span></span>
								<input type="text" :ref="(el) => refs.newFileId = el" placeholder="filename.html" />
								<button @click="codesandbox.newFile($event.target.previousSibling.value)">+</button>
							</div>
						</template>
					</Dropdown>
				</template>
			</ButtonGroup>


			<div class="session-buttons" v-if="codesandbox.state.fileSelected">
				<ButtonGroup :active="codesandbox.fileList[codesandbox.state.fileSelected].partSelected" @click="($event) => ($event.target.innerText) ? codesandbox.setSession($event.target.innerText) : ''">
					<template v-slot:button>
						<Dropdown>
							<template v-slot:button>
								<button><i class="fa fa-angle-down"></i></button>
							</template>
							<template v-slot:dropdown>
								<div style="display:grid;grid-template-columns: 1fr 1fr auto;">
									<p>Tag id</p>
									<p>Language</p>
									<p></p>
									<template v-for="(value, key) in codesandbox.getParts()">
										<input :value="key" @change="codesandbox.changeSectionName(key, $event.target.value)" />
										<input :value="value.lang" @change="codesandbox.changeSectionLang(key, $event.target.value)" />
										<button>-</button>
									</template>
									<input type="text" :ref="(el) => refs.newPartId = el" placeholder="tag id" />
									<input type="text" :ref="(el) => refs.newPartLang = el" placeholder="language" />
									<button @click="codesandbox.addPart(refs.newPartId.value, refs.newPartLang.value)">+</button>
								</div>
							</template>
						</Dropdown>
					</template>
					<button class="session-button">full</button>
					<template v-for="(value, key) in codesandbox.fileList[codesandbox.state.fileSelected].parts">
						<button class="session-button">{{ key }}</button>
					</template>
				</ButtonGroup>
			</div>
			<div class="session-buttons" v-if="codesandbox.state.fileSelected && false">
				<Dropdown>
					<template v-slot:button>
						<button>
							<!-- <i class="fa fa-arrow-alt-circle-down"></i> -->
							<!-- <i class="fa fa-hand-point-down"></i> -->
							<!-- <i class="fa fa-chevron-circle-down"></i> -->
							<!-- <i class="fa fa-caret-down"></i> -->
							<!-- <i class="fa fa-sort-down"></i> -->
							<i class="fa fa-angle-down"></i>
						</button>
					</template>
					<template v-slot:dropdown>
						<div style="display:grid;grid-template-columns: 1fr 1fr auto;">
							<p>Tag id</p>
							<p>Language</p>
							<p></p>
							<template v-for="(value, key) in codesandbox.getParts()">
								<input :value="key" @change="codesandbox.changeSectionName(key, $event.target.value)" />
								<input :value="value.lang" @change="codesandbox.changeSectionLang(key, $event.target.value)" />
								<button>-</button>
							</template>
							<input type="text" :ref="(el) => refs.newPartId = el" placeholder="tag id" />
							<input type="text" :ref="(el) => refs.newPartLang = el" placeholder="language" />
							<button @click="codesandbox.addPart(refs.newPartId.value, refs.newPartLang.value)">+</button>
						</div>
					</template>
				</Dropdown>
				<button class="session-button" @click="codesandbox.setSession('full')">full</button>
				<template v-for="(value, key) in codesandbox.fileList[codesandbox.state.fileSelected].parts">
					<button class="session-button" @click="codesandbox.setSession(key)">{{ key }}</button>
				</template>
			</div>
		</div>

		<div id="editor-container" class="editor-container" :ref="(el) => refs.editorContainer = el">
			<div id="editor" :ref="(el) => refs.editor = el"></div>
			<button id="render-button" @click="codesandbox.renderCode()">
				<i class="fa fa-angle-double-right"></i>
			</button>

			<div id="render-button" @click="codesandbox.renderCode()" v-if="false">
				<button>
					<i class="fa fa-angle-double-right"></i>
				</button>
			</div>

		</div>


		<iframe :ref="(el) => refs.iframe = el"></iframe>

	</div>
</template>

<style scoped lang="scss">
.codesandbox-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: fit-content(3em) auto;
	align-self: stretch;
	position: relative;
	line-height: 1;
	height: 100%;
	width: 100%;
	max-width: 100%;
	max-height: 100%;
	overflow: hidden;
}

#render-button {
	display: flex;
	align-items: stretch;
	position: absolute;
	left: 50%;
	transform: translateX(-50%) translateY(-110%);

	border: 2px solid rgb(0, 0, 0);
	border-radius: 0.5ch;
}

.codesandbox-nav-top {
	position: relative;
	line-height: 1;
	width: 100%;
	max-width: 100%;
	height: 1.5em;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	grid-column: 1 / span 2;
	background-color: rgb(35, 35, 35);
	overflow: hidden;
}

.session-buttons {
	display: contents;
}

.editor-container {
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;
	overflow: auto;
}

.select-button {
	width: fit-content;
	min-width: 7em;
	text-overflow: ellipsis;
	overflow: hidden;
}

#editor {
	display: block;
	width: 100%;
	height: 100%;
}

iframe {
	height: 100%;
	width: 100%;
	//border: none;
}
</style>