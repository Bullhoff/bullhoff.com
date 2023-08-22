<script setup>

import { computed, reactive, onMounted } from 'vue';
import { useStore } from '@stores/store.js';

onMounted(() => {
})



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
