<script lang="ts" setup>
import type { Book } from '../types'

const props = defineProps<{ book: Book }>()
const { user } = storeToRefs(useAuthStore())

const isOwner = computed(() => {
	return user.value?.userId === props.book.ownerId
})

const href = computed(() => {
	return isOwner.value
		? `/profile/books/${props.book.id}`
		: `/books/${props.book.id}`
})
</script>

<template>
	<div
		class="inline-flex w-full justify-between items-center hover:bg-primary/5 h-26 p-2 rounded-lg"
	>
		<NuxtLink :to="href" class="inline-flex gap-3 items-center">
			<NuxtImg class="h-[88px] rounded-md" src="/img/book-fallback.webp" />
			<div class="flex flex-col">
				<h3 class="text-primary font-bold text-2xl font-lateef">
					{{ book.title }}
				</h3>
				<b class="text-xl font-lateef text-primary">{{ book.author }}</b>
				<p class="text-xl font-lateef text-primary/50">
					{{ book.description }}
				</p>
			</div>
		</NuxtLink>
		<Icon name="lucide:chevron-right" class="size-7! text-primary" />
	</div>
</template>
