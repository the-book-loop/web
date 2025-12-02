<script lang="ts" setup>
definePageMeta({
	middleware: ['logged-in'],
})

useSeoMeta({
	title: 'My Books',
})
</script>

<template>
	<div class="w-2xl bg-white p-4 rounded-xl space-y-4 h-fit">
		<div class="inline-flex w-full justify-between items-center">
			<h1 class="text-3xl font-bold text-primary font-lateef">My Books</h1>
			<Button variant="outline" as-child>
				<NuxtLink to="/profile/books/new">
					<Icon name="lucide:plus" />
					Add book
				</NuxtLink>
			</Button>
		</div>
		<MyBooksList />
	</div>
</template>
