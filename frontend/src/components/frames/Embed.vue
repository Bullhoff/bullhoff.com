<script setup>

import { useStore, useNextCloud, useConfig } from '@stores/store.js';
</script>

<template>
	<template v-if="$route.params.id && useStore().pages?.[$route?.params?.id]">
		<embed type="text/html" :src="'../pages/' + useStore().pages[$route.params.id].entry">
	</template>
</template>

<style scoped>
embed,
iframe {
	width: 100%;
	height: 100%;
}
</style>
