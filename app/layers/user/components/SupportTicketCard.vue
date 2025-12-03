<script lang="ts" setup>
import type { SupportTicket } from '../types'

const props = defineProps<{ ticket: SupportTicket }>()

const statusText = computed(() => {
	switch (props.ticket.status) {
		case 0:
			return 'Open'
		case 1:
			return 'In Progress'
		case 2:
			return 'Resolved'
		default:
			return 'Unknown'
	}
})

const statusColor = computed(() => {
	switch (props.ticket.status) {
		case 0:
			return 'bg-yellow-100 text-yellow-800'
		case 1:
			return 'bg-blue-100 text-blue-800'
		case 2:
			return 'bg-green-100 text-green-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
})

const formattedDate = computed(() => {
	return new Date(props.ticket.created).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
})
</script>

<template>
	<NuxtLink
		:to="`/profile/support/${ticket.id}`"
		class="inline-flex w-full justify-between items-center hover:bg-primary/5 p-4 rounded-lg border border-gray-200 transition-colors cursor-pointer"
	>
		<div class="flex flex-col gap-2 flex-1">
			<div class="inline-flex items-center gap-3">
				<h3 class="text-primary font-bold text-xl font-lateef">
					{{ ticket.subject }}
				</h3>
				<Badge :class="statusColor" class="text-xs">
					{{ statusText }}
				</Badge>
			</div>
			<div class="flex items-center gap-2 text-sm text-primary/70">
				<Icon name="lucide:calendar" class="size-4" />
				<span>{{ formattedDate }}</span>
			</div>
			<div
				v-if="ticket.adminResponse"
				class="flex items-start gap-2 mt-2 p-2 bg-gray-50 rounded text-sm"
			>
				<Icon name="lucide:message-circle" class="size-4 text-primary mt-0.5" />
				<p class="text-primary/80 line-clamp-2">{{ ticket.adminResponse }}</p>
			</div>
		</div>
		<Icon
			name="lucide:chevron-right"
			class="size-6 text-primary flex-shrink-0"
		/>
	</NuxtLink>
</template>
