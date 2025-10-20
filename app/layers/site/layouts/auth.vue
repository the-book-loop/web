<script lang="ts" setup></script>

<template>
	<main class="relative grid grid-cols-2 w-full h-dvh">
		<NuxtImg src="/logo.webp" class="absolute top-10 start-10 w-44" />
		<div
			class="relative flex flex-col size-full items-center justify-center space-y-6"
		>
			<slot />
		</div>
		<div class="relative flex size-full items-center justify-center">
			<NuxtImg class="w-3/5" src="/img/reading-glasses.webp" />
		</div>
		<svg
			viewBox="0 0 506 249"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="absolute bottom-0 start-0 w-md"
		>
			<path
				d="M345 208.5C417.336 239.104 505.5 250.5 505.5 250.5H0V0C0 0 11.4128 71.9428 59 90C125.986 115.418 193.158 67.743 249.5 112C279.258 135.375 319 197.5 345 208.5Z"
				fill="#011166"
			/>
		</svg>
		<svg
			viewBox="0 0 505 251"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="absolute top-0 end-0 w-md"
		>
			<path
				d="M174.5 83.5C123.558 23.7171 0 0 0 0H505.5V250.5C505.5 250.5 490.587 212.557 443 194.5C376.014 169.082 294.342 217.257 238 173C208.242 149.625 199.043 112.302 174.5 83.5Z"
				fill="#011166"
			/>
		</svg>
	</main>
</template>
