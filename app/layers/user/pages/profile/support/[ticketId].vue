<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { useRouteParams } from '@vueuse/router'
import { supportTicketOptions } from '../../../queries/getSupportTicket'

const ticketId = useRouteParams('ticketId', '', { transform: String })

const { data: ticket, isLoading } = useQuery(supportTicketOptions(ticketId))

useSeoMeta({
	title: () =>
		isLoading.value
			? 'Loading...'
			: `Support Ticket - ${ticket.value?.subject}`,
})
</script>

<template>
	<div class="w-2xl bg-white rounded-xl">
		<template v-if="isLoading || !ticket">
			<div class="p-4 animate-pulse space-y-4">
				<div class="h-10 w-3/4 bg-slate-200 rounded" />
				<div class="h-6 w-1/4 bg-slate-200 rounded" />
				<div class="h-32 w-full bg-slate-200 rounded" />
			</div>
		</template>
		<template v-else>
			<div class="p-4 border-b border-gray-200">
				<div class="flex items-center justify-between mb-2">
					<NuxtLink
						to="/profile/support"
						class="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors"
					>
						<Icon name="lucide:arrow-left" class="size-5" />
						<span class="font-lateef">Back to Support</span>
					</NuxtLink>
					<Badge :class="getTicketStatusColor(ticket.status)">
						{{ fmtTicketStatus(ticket.status) }}
					</Badge>
				</div>
				<h1 class="text-3xl font-bold text-primary font-lateef mb-2">
					{{ ticket.subject }}
				</h1>
				<div class="flex items-center gap-2 text-sm text-primary/60">
					<Icon name="lucide:calendar" class="size-4" />
					<span>Created {{ fmtTicketCreationDate(ticket.created) }}</span>
				</div>
			</div>

			<div class="p-6 space-y-6">
				<div>
					<h2 class="text-xl font-semibold text-primary font-lateef mb-3">
						Your Message
					</h2>
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="text-primary/80 font-lateef whitespace-pre-wrap">
							{{ ticket.message }}
						</p>
					</div>
				</div>

				<div class="border-t pt-6">
					<h2 class="text-xl font-semibold text-primary font-lateef mb-3">
						Ticket Information
					</h2>
					<div class="flex flex-col space-y-1">
						<div class="inline-flex gap-2">
							<span class="font-lateef text-primary/60">Ticket ID:</span>
							<span class="font-lateef text-primary">{{ ticket.id }}</span>
						</div>
						<div class="inline-flex gap-2">
							<span class="font-lateef text-primary/60">Status:</span>
							<span class="font-lateef text-primary">
								{{ fmtTicketStatus(ticket.status) }}
							</span>
						</div>
						<div class="inline-flex gap-2">
							<span class="font-lateef text-primary/60">Your Email:</span>
							<span class="font-lateef text-primary">
								{{ ticket.userEmail }}
							</span>
						</div>
					</div>
				</div>

				<div v-if="ticket.adminResponse" class="border-t pt-6">
					<div class="flex items-center gap-2 mb-3">
						<Icon
							name="lucide:message-circle-reply"
							class="size-5 text-primary"
						/>
						<h2 class="text-xl font-semibold text-primary font-lateef">
							Admin Response
						</h2>
					</div>
					<div class="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
						<p class="text-primary/80 font-lateef whitespace-pre-wrap">
							{{ ticket.adminResponse }}
						</p>
						<div
							v-if="ticket.respondedAt"
							class="flex items-center gap-2 text-sm text-primary/60 mt-3"
						>
							<Icon name="lucide:clock" class="size-4" />
							<span>Responded {{ fmtResponseDate(ticket.respondedAt) }}</span>
						</div>
					</div>
				</div>

				<div v-else class="border-t pt-6">
					<div class="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
						<Icon name="lucide:info" class="size-5 text-blue-600" />
						<p class="text-blue-800 font-lateef">
							Our support team will respond to your ticket soon.
						</p>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
