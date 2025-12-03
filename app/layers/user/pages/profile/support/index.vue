<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { supportTicketsOptions } from '../../../queries/getSupportTickets'

useSeoMeta({
	title: 'Technical Support',
})

const { data: tickets, isLoading } = useQuery(supportTicketsOptions())
</script>

<template>
	<div class="w-2xl bg-white p-4 rounded-xl">
		<div class="inline-flex w-full justify-between mb-6">
			<h1 class="text-3xl font-bold text-primary font-lateef">
				Technical Support
			</h1>
			<CreateSupportTicketDialog>
				<Button>
					<Icon name="lucide:plus" />
					New
				</Button>
			</CreateSupportTicketDialog>
		</div>

		<div v-if="isLoading" class="flex flex-col gap-3">
			<div
				v-for="i in 3"
				:key="i"
				class="animate-pulse h-24 bg-gray-200 rounded-lg"
			/>
		</div>

		<div
			v-else-if="!tickets || tickets.length === 0"
			class="flex flex-col items-center justify-center py-12 text-center"
		>
			<Icon name="lucide:inbox" class="size-16! text-primary/30 mb-4" />
			<h3 class="text-xl font-semibold text-primary mb-2 font-lateef">
				No Support Tickets
			</h3>
			<p class="text-primary/60 font-lateef">
				You haven't created any support tickets yet.
			</p>
		</div>

		<div v-else class="flex flex-col gap-3">
			<SupportTicketCard
				v-for="ticket in tickets"
				:key="ticket.id"
				:ticket="ticket"
			/>
		</div>
	</div>
</template>
