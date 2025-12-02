<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { bookOptions } from '~/layers/books/queries/getBook'

const bookId = useRouteParams('bookId', '', { transform: String })

const { data: book } = useQuery(bookOptions(bookId))

useSeoMeta({
	title: () => (book.value ? `Edit ${book.value.title}` : 'Edit Book'),
})
</script>

<template>
	<div class="w-2xl h-fit bg-white p-4 rounded-lg space-y-4">
		<h1 class="text-3xl font-bold text-primary font-lateef">Edit a book</h1>
		<EditBookForm v-if="book" :book />
	</div>
</template>
