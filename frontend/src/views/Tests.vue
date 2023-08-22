<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, reactive } from 'vue';
import NavigationTree from '@components/NavigationTree.vue'

const components = reactive({})
const refs = reactive({});
const state = reactive({});
const props = defineProps({});
onMounted(() => {
	getFiles()
});
async function getFiles(toObj = components) {
	let files = import.meta.glob('../components/tests/**/*.vue');	// import.meta.glob('./**/*.vue');		// import.meta.globEager(url)		@components/tests/**/*.vue
	for (const key in files) {
		let val = await files[key]();
		let {filepath, filename, } = await getFileInfo(key)
		setObjectKeyValue(filepath, filename, val.default, components)
	}
	console.log('files', files)
}
function getFileInfo(fullfilepath, root=`../components/tests/`){
	fullfilepath = fullfilepath.replace(root, '')
	let obj = {}
	obj.filepath = fullfilepath.split('/');
	obj.filename = obj.filepath.pop()
	let filenameSplitted = obj.filename.split('.')
	obj.ext = filenameSplitted.pop()
	obj.name = filenameSplitted.join('')
	return obj
}
function setObjectKeyValue(path, name, val, resObj = {}){
	console.log('setObjectKeyValue', { folder:path[0],path, name, val, resObj, },)
	if(!path || (path && path.length == 0)) {
		resObj[name] = markRaw(val)
		return resObj
	}

	let folder = path.shift()
	if(folder) {
		if(folder == '.') return setObjectKeyValue(path, name, val, resObj)
		if(!resObj[folder]) resObj[folder] = {}
		return setObjectKeyValue(path, name, val, resObj[folder])
	}

}


</script>

<template>
	<div style="width:100%;height:100%;" >
		<NavigationTree :obj="components" />
	</div>
</template>

<style scoped lang="scss">
</style>
