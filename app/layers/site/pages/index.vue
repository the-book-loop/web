<script lang="ts" setup>
import ThemeToggle from '~/core/components/ThemeToggle.vue';

useSeoMeta({
	title: 'Home',
});
</script>

<template>
	<main
		class="flex flex-col min-h-dvh w-full items-center justify-center gap-4"
	>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			BookLoop
		</h1>
		<ThemeToggle />
	</main>
</template>
