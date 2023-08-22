<script setup>

import { useStore } from '@stores/store.js';
</script>

<template>
	<template v-if="$route.params.id && useStore().pages?.[$route?.params?.id]">
		<object :data="'../pages/' + useStore().pages[$route.params.id].entry"></object>
	</template>
</template>

<style scoped>
object,
embed,
iframe {
	width: 100%;
	height: 100%;
}
</style>
