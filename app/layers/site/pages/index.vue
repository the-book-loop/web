<script lang="ts" setup>
import ThemeToggle from '~/core/components/ThemeToggle.vue'

definePageMeta({
	middleware: ['logged-in'],
})

useSeoMeta({
	title: 'Home',
})
</script>

<template>
	<h1
		class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-lateef text-primary"
	>
		Hello, Book Lover!
	</h1>
</template>
