<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, reactive } from 'vue';
import Dropdown from '@components/Dropdown.vue'
//import  './imagetotext.js'
import { useStore, useNextCloud, useConfig } from '@stores/store.js';
//import {SvgBin} from './SvgIcons.vue';
const refs = reactive({});
const state = reactive({});
const props = defineProps({});

//watch(() => props.value,(newValue, oldValue) => {},{immediate: true});
//watch(state,(newValue, oldValue) => {console.log(`watch`, {...oldValue}, {...newValue});},{deep: true, immediate: true});
//watch(inputValueRo, (value) => {});
onMounted(() => {
	import('./imagetotext.js').then((res) => {
		console.log('res', res)
		res.main();
	})

});

</script>

<template>
	<Teleport :to="useStore().refs.extraSettings">
		<div class="important-fixes" style="max-width:30em;">
			<p>Not in a very usable condition. Things that i have to fix: </p>
			<ul style="font-size: 80%;">
				<li><u>Fix ui</u></li>
				<li>
					<!-- Downscales in the worker if the image is larger than most browsers allow on canvas. Modify that function. -->
					<u>Fix downscaling</u> - Currently theres no option to downscale uploaded pictures, so images larger than ~100x100px gives bad result. 
				</li>
				<li>
					<!-- Worked fine prior to moving the text canvas to a offscreencanvas (that is used in the worker.js) -->
					<u>Fix firefox filesave from the offscreen worker canvas</u> - When downloading the result image with firefox it will just save a blank image. 
				</li>
			</ul>
		</div>

	</Teleport>
	<nav id="menu-container">
		<button id="btn-convert">Go</button>

		<button id="btn-new-colors" title="Generate new colors. Color mode has to be on Random. ">NewColors</button>
		<select id="color-mode" title="Color mode">
			<option value="gray">Gray</option>
			<option value="random">Random</option>
			<option value="normal">Normal</option>
		</select>
		<input id="input-file" type="file">

		<span id="output-toggle-buttons">
			<button id="btn-textcanvas" style="background-color: green;">CanvasText</button>
			<button id="btn-textcanvas2">CanvasText2</button>
			<button id="btn-canvas">Canvas</button>
			<button id="btn-text">Span</button>
			<button id="btn-textarea">Textarea</button>
		</span>

		<select id="sel-characterset"></select>
		<input id="input-characterset" type="text" placeholder="characters" title="Enter characters to use here, \nor leave this empty to use the characters selected in the dropdown to the left. " />
		<input id="checkbox-reverse" type="checkbox" title="Use the characterset reversed" />
		<select id="sel-fontfamily"></select>
		<input id="input-fontsize" type="number" style="width:5ch;" />

		<!-- <Dropdown>
			<template v-slot:button>
				<button id="btn-fileSelected" class="select-button">*</button>
			</template>
			<template v-slot:dropdown>
				<div style="display:grid;grid-template-columns: auto auto auto;">
				</div>
			</template>
		</Dropdown> -->


		<input type="text" id="input-filename" placeholder="filename" />
		<!-- <label>
                <span>
                    <input type="radio" name="saveFileType" id="radio-png" value="imagepng" checked/>
                </span>
                png
            </label>
            <label>
                <input type="radio" name="saveFileType" id="radio-txt" value="imagetxt"/>
                txt
            </label> -->
		<select id="output-filetype">
			<option value="png">png</option>
			<option value="txt">txt</option>
		</select>
		<button id="save-image">Save image</button>
		<!-- <div id="div">div</div>
			<button id="btn">btn</button>
			<button id="btn1" onclick="onClick()">onClick()</button>
			<button id="btn2" onclick="onClick">onClick</button>
			<a href="#" onClick="window.open('examples/sample.htm','Sample','toolbar=no,width=190,height=190,left=500,top=200,status=no,scrollbars=no,resize=no');return false">See the sample</a>.
			<a href="#" onClick="window.open('examples/sample.htm','Sample','toolbar=no,width=190,height=190,left=500,top=200,status=no,scrollbars=no,resize=no');return false">See the sample</a>. -->

		<label>
			<input type="checkbox" id="checkbox-convert-on-change" />
			Convert on change
		</label>



		<select id="select-max-size" title="Scale down image to fit" disabled>
			<option value="32">32 x 32</option>
			<option value="64">64 x 64</option>
			<option value="128">128 x 128</option>
			<option value="256">256 x 256</option>
			<option value="512">512 x 512</option>
			<option value="1024">1024 x 1024</option>
			<option value="2160">2160 x 2160</option>
			<option value="3840">3840 x 3840</option>
			<option value="5120">5120 x 5120</option>
			<option value="8192">8192 x 8192</option>
			<option value="16384">16384 x 16384</option>
		</select>
		<!-- <label>
                <input type="checkbox" id="checkbox-gray" />
                Gray
            </label>

            <label>
                <input type="checkbox" id="checkbox-random-colors" />
                Random colors
            </label> -->

		<!-- <button id="checkbox-gray">Gray</button>
            <button id="checkbox-random-colors">RandomColors</button> -->

	</nav>
	<div id="output-container">
		<canvas id="output-textcanvas" style="display: block; "></canvas>
		<canvas id="output-textcanvas2" style="display: block; "></canvas>
		<canvas id="output-canvas" style="display: none;"></canvas>
		<div id="output-text" style="display: none;"></div>
		<textarea id="output-textarea" spellcheck="false" style="display: none;"></textarea>

		<!-- <div id="output-span" style="visibility: visible;"></div>
            <textarea id="output-textarea" style="visibility: hidden;"></textarea>
            <canvas id="output-canvas" style="visibility: hidden;"></canvas> -->

		<!-- <div id="testcontainer" style="width: fit-content; margin: 0; padding: 0"></div>
			<div id="container"></div> -->

	</div>
</template>

<style scoped lang="scss">
select {
	max-width: 10ch;
}

#sel-characterset>* {
	display: block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 20ch;
	max-width: 20ch;
	object-fit: contain;
	box-sizing: border-box;
}

.btn-active {
	background-color: green;
}

#menu-container {
	/* display: grid;
    grid-auto-flow: column;  */
	/* align-items: stretch; */
	display: flex;
	flex-direction: row;
	/* height:3ch; */
	/* justify-content:stretch;
    justify-items: stretch; */
	/* justify-content:baseline;
    align-items:baseline; */
	/* flex: 1; */
}

#menu-container>* {
	display: block;
	height: 100%;
	justify-self: baseline;
	/* border: 5px solid rgb(0, 255, 94); */
	/* background-color: aqua;
    border: 1px solid red; */
	/* justify-self: baseline; */
	/* flex: 1; */
}

label {
	display: flex;
	flex-direction: row;
	justify-items: baseline;
	/* border: 5px solid rgb(0, 255, 94); */
}

label>* {
	justify-self: baseline;
	/* justify-self: baseline;
    border: 5px solid red; */
}

input[type=radio] {
	justify-self: baseline;
	border: 5px solid red;
}

#output-container {
	font-family: monospace;
	display: block;
	width: 100%;
	height: 100%;
	object-fit: contain;

}

/* #output-container > * {
    object-fit: contain; 
    overflow: auto;
}
#output-container > div, textarea {
    white-space: pre;
    width: 100%;  
    height: 100%;
} */

#output-container>div,
textarea,
canvas {
	object-fit: contain;
	overflow: auto;
	white-space: pre;
	width: 100%;
	height: 100%;
	/* height: fit-content; */
	/* position:absolute; */
}
</style>
