<script lang="ts" setup>
import type { SupportTicket } from '../types'

defineProps<{ ticket: SupportTicket }>()
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
				<Badge :class="getTicketStatusColor(ticket.status)" class="text-xs">
					{{ fmtTicketStatus(ticket.status) }}
				</Badge>
			</div>
			<div class="flex items-center gap-2 text-sm text-primary/70">
				<Icon name="lucide:calendar" class="size-4" />
				<span>{{ fmtTicketCreationDate(ticket.created) }}</span>
			</div>
			<div
				v-if="ticket.adminResponse"
				class="flex items-start gap-2 mt-2 p-2 bg-gray-50 rounded text-sm"
			>
				<Icon name="lucide:message-circle" class="size-4 text-primary mt-0.5" />
				<p class="text-primary/80 line-clamp-2">{{ ticket.adminResponse }}</p>
			</div>
		</div>
		<Icon name="lucide:chevron-right" class="size-6 text-primary shrink-0" />
	</NuxtLink>
</template>
