import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
	base: '/',
	watch: false,
	exclude: ['node_modules/**', '_**/', '__**/**', '**/__**', '**/__*', '**/_**', '*/pages/*', '*/assets/*'],
	assetsInclude: ['**/*.png', '**/*.ttf', '**/*.TTF', '**/*.txt'],
	plugins: [
		vue({ template: { compilerOptions: { isCustomElement: (tag) => ['pizza-power'].includes(tag), }, }, }),
		vueJsx(),
		Components(),
		AutoImport({
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/, // .vue
				/\.md$/, // .md
			],
			imports: ['vue', 'vue-router', 'pinia'],
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
			'@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
			'@scripts': fileURLToPath(new URL('./src/scripts', import.meta.url)),
			'@components': fileURLToPath(new URL('./src/components', import.meta.url)),
			'@views': fileURLToPath(new URL('./src/views', import.meta.url)),
			'@nextcloud': fileURLToPath(new URL('./src/scripts/nextcloud', import.meta.url)),
		},
	},

	css: {
		preprocessorOptions: {
			scss: {
				//additionalData: `@import "@/assets/main.scss";`,
			},
			postcss: {
				plugins: [require('postcss-import'), require('autoprefixer')],
			},
		},
	},
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			external: [],
		},
	}
});
