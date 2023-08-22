<template>
	<div id="header-left-collapsed">
		<Dropdown svg="#svg-bento" :iconStyle="{ ...iconStyle, width: iconStyle.height }" :config="{ closeOnClick: true }">
			<template v-slot:button></template>
			<template v-slot:dropdown>
				<div class="routerlinks-vertical">
					<RouterLinks />
				</div>
			</template>
		</Dropdown>
	</div>
	<div id="header-left">
		<RouterLinks />
	</div>
	<div class="header-mid">
		<span :ref="(el) => refs.extraSettingsDropDown = el" style="visibility:hidden;">
			<Dropdown :ref="(el) => refs.dropdownControl = el">
				<template v-slot:button>
					<button>{{ capitalize(useStore().currentPage.name) }}</button>
				</template>
				<template v-slot:dropdown>
					<div id="extra-settings" :ref="(el) => useStore().refs.extraSettings = el"></div>
				</template>
			</Dropdown>
		</span>
	</div>

	<div style="" class="header-right">
		<Menu />
	</div>
</template>

<script setup>
import Menu from '@components/Menu.vue';
import { capitalize } from '@scripts/scripts.js';
import { useStore, useNextCloud, useConfig, useStyle, useAssets } from '@stores/store.js';
import { onMounted, reactive } from 'vue';
import { PizzaTime } from '@scripts/pizzatime.js';
import RouterLinks from './RouterLinks.vue';
import Dropdown from '@components/Dropdown.vue';
const refs = reactive({ extraSettingsDropDown: null });
let iconStyle = { height: '1.5rem', 'min-width': '1rem', 'object-fit': 'contain', 'object-position': 'center' };
onMounted(() => {
	extraSettingsObserver.observe(
		useStore().refs.extraSettings,
		{ childList: true, }	// childList: true,  attributes: true, characterData: true, subtree: true, attributeFilter: ["status", "username"]
	);
});

let extraSettingsObserver = new MutationObserver(function (mutationsList) {
	if (!useStore().refs.extraSettings || useStore().refs.extraSettings.children.length < 1) refs.extraSettingsDropDown.style.visibility = 'hidden'
	if (useStore().refs.extraSettings.children.length > 0) {
		refs.extraSettingsDropDown.style.visibility = 'visible'
		if (refs.extraSettingsDropDown.getElementsByClassName('important-fixes').length > 0) {
			refs.dropdownControl.onClick()
		}
	}
})

</script>

<style scoped>
#header-left {
	line-height: 1;
	display: flex;
	flex-direction: inherit;
	flex-wrap: nowrap;
	height: 100%;
	align-items: center;
}

.header-right {
	line-height: 1;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	width: fit-content;
	height: 100%;
	gap: 0 0.2ch;
	padding: 0 0.5em;
	margin-left: auto;
}

.header-mid {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	width: fit-content;
	height: 100%;
	gap: 0 1ch;
	margin-left: auto;
	margin-right: auto;
}

#container {
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;
}

#header-left-collapsed {
	display: none;
}

.routerlinks-vertical {
	display: flex;
	flex-direction: column;
}

@media (max-width: 1366px) {
	#header-left-collapsed {
		display: inline-block;
	}

	#header-left {
		display: none;
	}
}
</style>
