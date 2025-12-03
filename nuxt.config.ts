import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },
	extends: [
		'./app/core',
		'./app/layers/site',
		'./app/layers/auth',
		'./app/layers/user',
		'./app/layers/books',
		'./app/layers/exchanges',
		'./app/layers/chats',
	],
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
			'./app/layers/**/composables',
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
		'@nuxt/image',
		'@nuxt/fonts',
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
		customCollections: [
			{
				prefix: 'custom',
				dir: './app/core/assets/icons',
			},
		],
	},
	pinia: {
		storesDirs: ['./**/stores/**'],
	},
	colorMode: {
		classSuffix: '',
		preference: 'light',
		fallback: 'light',
	},
	fonts: {
		families: [
			{
				name: 'Lateef',
				provider: 'google',
				weights: [400, 500, 600, 700, 800],
			},
		],
	},
	vite: {
		plugins: [tailwindcss()],
	},
	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
			signalrHubUrl:
				process.env.NUXT_PUBLIC_SIGNALR_HUB_URL ||
				`${process.env.NUXT_PUBLIC_API_BASE_URL}/hubs/chat`,
		},
	},
	app: {
		head: {
			titleTemplate: '%s | BookLoop',
		},
		pageTransition: { name: 'page', mode: 'out-in' },
	},
})
