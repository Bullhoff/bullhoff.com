<script setup>
//import test from './test.html'
//import { html } from 'vite-plugin-html'
//const test = await html('./test.html')
import { onMounted, reactive, nextTick, computed, watch, onBeforeMount } from 'vue';

//import test from '!!raw-loader!./test.html'
import { useStore, useNextCloud, useConfig } from '@stores/store.js';

const refs = reactive({ iframe: null })
window.addEventListener("message", (e) => {
	console.log('message', { pagename, data: e.data, e })
	useStore().log('iframe', 'message', { pagename, data: e.data, e })

	if (pagename.value && e.data.save && useStore()[pagename.value]) {
		Object.assign(useStore()[pagename.value], e.data.save)
		useConfig().save(pagename.value, useStore()[pagename.value]);
	}
},
	false,
);

const pagename = computed(() => useStore().currentPage.name)
const id = computed(() => useStore().currentPage.id)
function sendData() {
	let data = useStore()[pagename.value]

	setTimeout(() => {
		let interval = setInterval(() => {
			if (refs.iframe?.contentWindow) {
				useStore().log('iframe', 'onMounted', { pagename, data, iframe: refs.iframe, contentWindow: refs.iframe?.contentWindow })
				if (data != undefined || data != null) refs.iframe.contentWindow.postMessage(structuredClone(toRaw(data)), '*');
				useStore().log('iframe', 'onMounted', { pagename, iframe: refs.iframe, contentWindow: refs.iframe?.contentWindow })
				interval = clearInterval(interval)
			} else {
				if (pagename.value != 'fixtext' && pagename.value != 'codesandbox' && pagename.value != 'imagetotext') {
					interval = clearInterval(interval)
				}
				useStore().log('iframe', 'onMounted', { interval })
			}
		}, 50)
	}, 1000)
}

watch(() => useStore().currentPage.name, (newVal) => {
	console.log('watch', newVal)
	sendData()
});
onMounted(() => {
	sendData()
})

function test() {
	console.log('test', refs.iframe)
	refs.iframe.contentWindow.postMessage({ ye: 'aaaa' }, '*');
}
</script>

<template>
	<button @click="test()" style="z-index:10">click</button>
	<template v-if="$route.params.id && useStore().pages?.[$route?.params?.id]">
		<iframe :ref="(el) => refs.iframe = el" :src="'../pages/' + useStore().pages[$route.params.id].entry" :title="useStore().pages[$route.params.id].name" frameborder="0"></iframe>
	</template>
</template>

<style scoped>
embed,
iframe {
	width: 100%;
	height: 100%;
}
</style>
