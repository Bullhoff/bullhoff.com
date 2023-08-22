import './assets/main.css';
import './assets/main.scss';

import GlobalComponents from './globals';

import {createApp} from 'vue';
import {createPinia, } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(GlobalComponents);
app.use(createPinia());
app.use(router);

app.mount('#app');
