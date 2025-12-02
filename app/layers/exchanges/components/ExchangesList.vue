<script lang="ts" setup>
import type { Exchange } from '../types'

const props = defineProps<{
	data: Exchange[] | undefined
	isLoading: boolean
	type: 'sent' | 'received'
}>()

const emptyTitle = computed(() => {
	return props.type === 'sent' ? 'No exchanges sent' : 'No exchanges received'
})
</script>

<template>
	<div
		v-if="!data?.length"
		class="flex flex-col items-center justify-start p-3 text-center"
	>
		<h3 class="text-3xl font-semibold text-primary font-lateef mb-2">
			{{ emptyTitle }}
		</h3>
		<p class="text-primary/50 max-w-md">
			There are no exchanges to display at the moment.
		</p>
	</div>
	<div class="flex flex-col w-full gap-3">
		<ExchangeCard v-for="(exchange, i) in data" :key="i" :exchange :type />
	</div>
</template>
