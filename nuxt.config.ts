import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	extends: ['./app/core', './app/layers/site'],
	dir: {
		assets: './app/core/assets',
		plugins: './app/core/plugins',
		middleware: './app/core/middleware',
		layouts: './app/layers/site/layouts',
		pages: './app/layers/site/pages',
		public: './app/layers/site/public',
	},
	imports: {
		dirs: [
			'./app/core/types',
			'./app/core/constants',
			'./app/layers/**/types',
			'./app/layers/**/constants',
			'./app/layers/**/queries',
		],
	},
	modules: [
		'@nuxt/eslint',
		'shadcn-nuxt',
		'@vueuse/nuxt',
		'@nuxt/icon',
		'@pinia/nuxt',
		'@nuxtjs/color-mode',
		'pinia-plugin-persistedstate/nuxt',
	],
	css: ['./app/core/assets/tailwind.css'],
	shadcn: {
		prefix: '',
		componentDir: './app/core/components/ui',
	},
	icon: {
		provider: 'iconify',
		serverBundle: {
			collections: ['lucide'],
		},
	},
	pinia: {
		storesDirs: ['./**/stores/**'],
	},
	colorMode: {
		classSuffix: '',
	},
	vite: {
		plugins: [tailwindcss()],
	},
	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
		},
	},
	app: {
		head: {
			titleTemplate: '%s | BookLoop',
		},
	},
});
