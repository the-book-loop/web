<script lang="ts" setup>
import { EXCHANGE_STATUS } from '../constants'
import { useCancelExchange } from '../mutations/useCancelExchange'
import { useUpdateExchange } from '../mutations/useUpdateExchange'
import type { Exchange } from '../types'

const props = defineProps<{ exchange: Exchange; type: 'sent' | 'received' }>()

const { mutateAsync, isPending } = useUpdateExchange()
const { mutateAsync: cancelExchange, isPending: isCancelPending } =
	useCancelExchange()

const badgeClass = (status: number) => {
	switch (status) {
		case 0:
			return 'bg-yellow-100 text-yellow-800'
		case 1:
			return 'bg-green-100 text-green-800'
		case 2:
			return 'bg-red-100 text-red-800'
		default:
			return 'bg-slate-100 text-slate-800'
	}
}

const handleExchangeAccept = () => {
	mutateAsync({
		exchangeId: props.exchange.id,
		status: EXCHANGE_STATUS.ACCEPTED,
	})
}

const handleExchangeDecline = () => {
	mutateAsync({
		exchangeId: props.exchange.id,
		status: EXCHANGE_STATUS.DECLINED,
	})
}

const handleExchangeCancel = () => {
	cancelExchange(props.exchange.id)
}
</script>

<template>
	<div
		class="inline-flex w-full justify-between items-center p-3 rounded-lg hover:bg-primary/10"
	>
		<NuxtLink class="flex flex-col" :to="`/books/${exchange.bookId}`">
			<div class="inline-flex gap-1">
				<p class="font-lateef text-xl text-primary/50">Book:</p>
				<p class="font-lateef text-xl text-primary">{{ exchange.bookTitle }}</p>
			</div>
			<div class="inline-flex gap-1">
				<p class="font-lateef text-xl text-primary/50">From:</p>
				<p class="font-lateef text-xl text-primary">
					{{ exchange.receiverFirstName }}
				</p>
			</div>
		</NuxtLink>
		<div class="inline-flex gap-2 items-center">
			<div
				class="h-fit text-xs p-2 rounded-full"
				:class="badgeClass(exchange.status)"
			>
				{{ fmtExchangeStatus(exchange.status) }}
			</div>
			<template v-if="exchange.status === EXCHANGE_STATUS.PENDING">
				<template v-if="type === 'sent'">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger as-child>
								<Button
									variant="outline"
									size="icon"
									:disabled="isCancelPending"
									@click="handleExchangeCancel"
								>
									<Icon name="lucide:x" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Cancel</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</template>
				<template v-else>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger as-child>
								<Button
									size="icon"
									:disabled="isPending"
									@click="handleExchangeAccept"
								>
									<Icon name="lucide:check" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Accept</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger as-child>
								<Button
									variant="outline"
									size="icon"
									:disabled="isPending"
									@click="handleExchangeDecline"
								>
									<Icon name="lucide:x" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Decline</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</template>
			</template>
		</div>
	</div>
</template>
