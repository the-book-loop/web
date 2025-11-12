<script lang="ts" setup>
definePageMeta({
	middleware: ['logged-in'],
})

useSeoMeta({
	title: 'Add a Book',
})
</script>

<template>
	<div class="w-2xl h-fit bg-white p-4 rounded-lg space-y-4">
		<h1 class="text-3xl font-bold text-primary font-lateef">Add a book</h1>
		<AddBookForm />
	</div>
</template>
