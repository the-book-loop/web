<script lang="ts" setup>
import { useQueries } from '@tanstack/vue-query'
import { sentExchangesOptions } from '../queries/getSentExchanges'
import { receivedExchangesOptions } from '../queries/getReceivedExchanges'

useSeoMeta({
	title: 'My Exchanges',
})

const results = useQueries({
	queries: [sentExchangesOptions(), receivedExchangesOptions()],
})

watch(results, (newResults) => {
	console.log('Exchanges Results:', newResults[0].data, newResults[1].data)
})
</script>

<template>
	<div class="flex flex-col w-2xl gap-4">
		<h2 class="font-bold tracking-tight text-3xl font-lateef text-primary">
			Sent
		</h2>
		<div class="flex flex-col w-full bg-white rounded-xl p-4">
			<ExchangesList
				:data="results[0].data"
				:is-loading="results[0].isLoading"
				type="sent"
			/>
		</div>
		<h2 class="font-bold tracking-tight text-3xl font-lateef text-primary">
			Received
		</h2>
		<div class="flex flex-col w-full bg-white rounded-xl p-4">
			<ExchangesList
				:data="results[1].data"
				:is-loading="results[1].isLoading"
				type="received"
			/>
		</div>
	</div>
</template>
