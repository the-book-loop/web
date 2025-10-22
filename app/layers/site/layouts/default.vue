<script lang="ts" setup></script>

<template>
	<main class="relative flex flex-col w-full h-dvh">
		<svg
			viewBox="0 0 1280 247"
			class="w-full absolute -top-10 -z-10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M-0.0231934 0H1279.5L1279.5 247C1236.5 185 1183.74 179.567 1107.5 170.5C1045.03 163.071 977.482 81.7684 915.501 71C804.569 51.7272 737.765 133.666 627.477 111C584.138 102.093 573.755 101.071 530 94.5C433.577 80.0183 394 142 359 149C325.841 155.632 236.538 134.322 204.5 123.5C126.522 97.1602 -0.0231934 134 -0.0231934 134V0Z"
				fill="#011166"
			/>
		</svg>

		<NuxtImg src="/logo-white.webp" class="absolute h-16 top-5 left-5" />

		<div class="grid grid-cols-[15%_85%] pt-[160px] px-10">
			<HomeSidebar />
			<slot />
		</div>

		<svg
			class="absolute bottom-0 right-0 w-sm"
			viewBox="0 0 506 376"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M160.5 335.5C88.1643 366.104 0 377.5 0 377.5H505.5V0C505.5 0 491.587 155.943 444 174C377.014 199.418 354.342 163.243 298 207.5C268.242 230.875 186.5 324.5 160.5 335.5Z"
				fill="#011166"
			/>
		</svg>
	</main>
</template>
