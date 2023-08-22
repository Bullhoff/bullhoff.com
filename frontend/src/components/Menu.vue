<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useStore, useNextCloud, useConfig, useStyle, useAssets } from '@stores/store.js';
import { onMounted, reactive } from 'vue';
//import {log} from '@scripts/scripts.js'
//import * as HamburgerMenu from './../../public/pages/components/hamburger.js';
import Dropdown from './Dropdown.vue';
import Stopwatch from './Stopwatch.vue';
import Countdown from './Countdown.vue';
import NextCloud from './NextCloud.vue';
import Settings from './Settings.vue';
import Output from './Output.vue';

import Debug from './Debug.vue';
import { SvgNextCloudWhite, SvgNextCloudBlue, SvgBicycle, SvgDebug, SvgPlay, SvgWrench, SvgSettings, SvgSettings2 } from './SvgIcons.vue';
const refs = reactive({ wrapper: null });
//defineProps({})
onMounted(() => {

});


let website = import.meta.env.VITE_SERVER_IP;
let iconStyle = { height: '1.5rem', 'min-width': '1rem', 'object-fit': 'contain', 'object-position': 'center' };
</script>

<template v-if="useStyle().refs.topmenu">
	<Dropdown v-if="useConfig().settings.debug">
		<template v-slot:button>
			<SvgDebug :wrapper="iconStyle" />
		</template>
		<template v-slot:dropdown>
			<Output />
		</template>
	</Dropdown>
	<Dropdown svg="#svg-clock" :iconStyle="{ ...iconStyle, width: iconStyle.height }">
		<template v-slot:button>
		</template>
		<template v-slot:dropdown>
			<Stopwatch :minimal="true" :columns="{ drag: { show: false }, }" />
		</template>
	</Dropdown>
	<Dropdown svg="#svg-alarm" :iconStyle="{ ...iconStyle, width: iconStyle.height }">
		<template v-slot:button></template>
		<template v-slot:dropdown>
			<Countdown :minimal="true" :columns="{ drag: { show: false }, }" />
		</template>
	</Dropdown>

	<Dropdown :iconStyle="{ ...iconStyle, width: iconStyle.height }">
		<template v-slot:button>
			<SvgSettings :wrapper="iconStyle" />
		</template>
		<template v-slot:dropdown>
			<Settings />
		</template>
	</Dropdown>

	<Dropdown :iconStyle="{ ...iconStyle, width: iconStyle.height }"> <!-- :iconStyle="{...iconStyle, width: iconStyle.height}" -->
		<template v-slot:button>
			<SvgNextCloudBlue v-if="useNextCloud().validLogin" :wrapper="iconStyle" />
			<SvgNextCloudWhite v-else :wrapper="iconStyle" />
		</template>
		<template v-slot:dropdown>
			<NextCloud />
		</template>
	</Dropdown>

	<Dropdown :iconStyle="{ ...iconStyle, width: iconStyle.height }">
		<template v-slot:button>
			<div :style="iconStyle">
				<SvgBicycle />
			</div>
		</template>
	</Dropdown>
	<div :style="{ ...iconStyle, width: '4em', }" style="display:block;position:relative;margin:0;padding:0 0 0 0em;" v-if="false">
		<ImageBox :src="useAssets().assets.icons['bicycle-svgrepo-com.svg']" :style="{ position: 'absolute', ...iconStyle, width: iconStyle.height, border: 'none', transition: 'transform 25s ease', left: 0 }" :inverted="true" @click="(e) => { e.target.style.transform = 'translateX(1550%)' }" />
	</div>

	<Dropdown :iconStyle="{ ...iconStyle, width: iconStyle.height }" v-if="false">
		<template v-slot:button>
			<!-- https://www.svgrepo.com/svg/450791/debug-script -->
			<SvgDebug :wrapper="iconStyle" />
		</template>
		<template v-slot:dropdown>
			<button @click="useNextCloud().testNextCloud()">testNextCloud</button>
			<Debug />
		</template>
	</Dropdown>
</template>

<style scoped>
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
</style>
