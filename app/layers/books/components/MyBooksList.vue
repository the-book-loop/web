<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { userBooksOptions } from '../queries/getUserBooks'
import BookCard from './BookCard.vue'
import BookCardSkeleton from './BookCardSkeleton.vue'

const { data: books, isLoading } = useQuery(userBooksOptions())
</script>

<template>
	<div v-if="isLoading">
		<BookCardSkeleton v-for="n in 4" :key="n" />
	</div>
	<div
		v-if="!books?.length && !isLoading"
		class="flex flex-col items-center justify-start p-8 text-center"
	>
		<div class="rounded-full bg-primary/10 p-6 mb-4">
			<Icon name="ph:book-open" class="!size-12 text-primary" />
		</div>
		<h3 class="text-3xl font-semibold text-primary font-lateef mb-2">
			No books found
		</h3>
		<p class="text-primary/50 max-w-md">
			There are no books to display at the moment. Please add some books to see
		</p>
	</div>
	<div v-if="books?.length && !isLoading">
		<BookCard v-for="book in books" :key="book.id" :book="book" />
	</div>
</template>
