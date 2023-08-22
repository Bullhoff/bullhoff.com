import { createRouter, createWebHistory } from 'vue-router';
import Portfolio from '../views/Portfolio.vue';
import { generateID } from '@scripts/scripts.js'
import { useStore, useNextCloud, useConfig,  } from '@stores/store.js';

const router = createRouter({
	mode: 'history',
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			alias: ['/:id',],
			name: 'portfolio',
			component: Portfolio,
		},
		{
			path: '/tests',
			name: 'Tests',
			component: () => import('../views/Tests.vue'),
		},
		{
			path: '/output',
			name: 'output',
			component: () => import('../components/Output.vue'),
		},
		
		{
			path: '/debug',
			name: 'debug',
			component: () => import('../components/Debug.vue'),
		},
		{
			path: '/stopwatch',
			name: 'stopwatch',
			component: () => import('../components/Stopwatch.vue'),
		},
		{
			path: '/countdown',
			name: 'countdown',
			component: () => import('../components/Countdown.vue'),
		},

		{
			path: '/pizzaspin',
			name: 'pizzaspin',
			component: () => import('../views/PizzaSpin.vue'),
		},
		{
			path: '/pizzatime',
			name: 'pizzatime',
			component: () => import('../views/PizzaTime.vue'),
		},
		{
			path: '/pizzabounce',
			name: 'pizzabounce',
			component: () => import('../views/PizzaBounce.vue'),
		},
		{
			path: '/fixtext',
			name: 'fixtext',
			component: () => import('../views/fixtext/FixText.vue'),
		},
		{
			path: '/codesandbox',
			name: 'codesandbox',
			component: () => import('../views/codesandbox/CodeSandbox.vue'),
		},
		{
			path: '/imagetotext',
			name: 'imagetotext',
			component: () => import('../views/imagetotext/ImageToText.vue'),
		},

		{
			path: '/embed/:id',
			name: 'embed',
			component: () => import('../components/frames/Embed.vue'),
		},
		{
			path: '/iframe/:id',
			name: 'iframe',
			component: () => import('../components/frames/Iframe.vue'),
		},
		{
			path: '/object/:id',
			name: 'object',
			component: () => import('../components/frames/Object.vue'),
		},

		{
			path: '/:catchAll(.*)*',
			name: 'notfound',
			component: () => import('../views/NotFound.vue'),
		},
		/* {			path: '/:pathMatch(.*)*', 			name: 'not-found',			component: () => import('../views/NotFound.vue'),		},  */
		/* { 			path: '/user-:afterUser(.*)',// will match anything starting with `/user-` and put it under `$route.params.afterUser`			//component: UserGeneric		}  */
	],
});
router.resolve({
	name: 'notfound',
	params: { catchAll: ['not', 'found'] },
}).href;



router.afterEach((to, from) => {
	Object.assign(to.query, from.query)
	const url = new URL(location);
	log('afterEach', 1, { to, from, url })

	for (const [key, value] of Object.entries(url.searchParams.entries())) {
		console.log('aftereachparams', key, value)
		url.searchParams.set(key, value);
	}
	for (const [key, value] of Object.entries(to.query)) {
		url.searchParams.set(key, value);
	}
	history.replaceState({}, "", url);
	log('afterEach', 2, { to, from, url })
});

function log() {
	if (window.Console) Console.log({ file: 'router/index.js' }, ...arguments)
	else console.log(...arguments)
}
router.beforeEach(async (to, from) => {
	if (!window.Console) console.log('router.beforeEach', { to, from })
	log('beforeEach', { to, from, env: import.meta.env })

	let name = to.name
	if (to.params?.id) name = to.params.id
	useStore().currentPage.name = name;
	useStore().currentPage.id = generateID();

	if (useStore().refs.extraSettings?.children?.length < 1) useStore().currentPage.show = false;
	else useStore().currentPage.show = true;
	log('beforeEach', useStore().currentPage.show, document.getElementById('#extra-settings')?.children?.length, document.getElementById('extra-settings'));

	// to.name == 'portfolio' && (useStore()?.portfolio?.length == 0 || !useStore().finishedLoading.portfolio) && true
	if (to.name == 'portfolio' && !useStore().finishedLoading.portfolio) {
		log('router.beforeEach', 'Getting portfolio', to.name, useStore().finishedLoading?.portfolio, useStore()?.portfolio?.length)
		var requestUrl = `${import.meta.env.VITE_SERVER_IP}/api?${(to.params?.id) ? to.params.id : to.name}`;
		fetch(requestUrl, { method: 'GET' })
			.then(async (response) => {
				console.log('response', response)
				return await response.json();
			})
			.then((data) => {
				if (data) {
					useStore().finishedLoading.portfolio = true
					return useStore().portfolio = data
				}
				log('beforeEach', 'data', data)
			})
			.finally((data) => {
				log('beforeEach', 'data.finally', data)
			})
			.catch((error) => {
				console.error(error);
			});
	}
});

export default router;
