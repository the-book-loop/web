<script lang="ts" setup>
import type { MessageResponse } from '../types'

const props = defineProps<{
	messages: MessageResponse[]
	currentUserId: string
	isLoading?: boolean
}>()

const emit = defineEmits<{
	loadMore: []
}>()

const messagesContainer = ref<HTMLElement | null>(null)
const shouldAutoScroll = ref(true)

const formatMessageTime = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	})
}

const isSentByCurrentUser = (message: MessageResponse) => {
	return message.senderId === props.currentUserId
}

const groupedMessages = computed(() => {
	const groups: Array<{
		date: string
		messages: MessageResponse[]
	}> = []

	props.messages.forEach((message) => {
		const messageDate = new Date(message.sentAt).toLocaleDateString()
		const existingGroup = groups.find((g) => g.date === messageDate)

		if (existingGroup) {
			existingGroup.messages.push(message)
		} else {
			groups.push({
				date: messageDate,
				messages: [message],
			})
		}
	})

	return groups
})

const formatGroupDate = (dateString: string) => {
	const date = new Date(dateString)
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	if (date.toDateString() === today.toDateString()) return 'Today'
	if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
	})
}

const scrollToBottom = () => {
	if (messagesContainer.value && shouldAutoScroll.value) {
		nextTick(() => {
			if (messagesContainer.value) {
				messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
			}
		})
	}
}

const handleScroll = () => {
	if (!messagesContainer.value) return

	const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
	const isAtBottom = scrollHeight - scrollTop - clientHeight < 100

	shouldAutoScroll.value = isAtBottom

	if (scrollTop === 0 && !props.isLoading) {
		emit('loadMore')
	}
}

watch(
	() => props.messages.length,
	() => {
		scrollToBottom()
	},
)

onMounted(() => {
	scrollToBottom()
})
</script>

<template>
	<div
		ref="messagesContainer"
		class="relative flex-1 overflow-y-auto p-4 max-h-80 w-3xl space-y-6 z-50"
		@scroll="handleScroll"
	>
		<div v-if="isLoading" class="flex justify-center py-4">
			<Icon name="lucide:loader-2" class="size-6 text-primary animate-spin" />
		</div>

		<div
			v-if="messages.length === 0 && !isLoading"
			class="flex items-center justify-center h-full"
		>
			<div class="text-center">
				<Icon
					name="lucide:message-circle"
					class="size-16 text-primary/30 mx-auto mb-4"
				/>
				<p class="text-lg font-lateef text-primary/50">No messages yet</p>
				<p class="text-sm font-lateef text-primary/40 mt-2">
					Start a conversation by sending a message
				</p>
			</div>
		</div>

		<div v-for="group in groupedMessages" :key="group.date" class="space-y-2">
			<div class="flex justify-center">
				<span
					class="px-3 py-1 bg-primary/10 text-primary/70 rounded-full text-xs font-lateef"
				>
					{{ formatGroupDate(group.date) }}
				</span>
			</div>

			<div
				v-for="message in group.messages"
				:key="message.id"
				class="flex"
				:class="isSentByCurrentUser(message) ? 'justify-end' : 'justify-start'"
			>
				<div
					class="max-w-[70%] flex flex-col"
					:class="isSentByCurrentUser(message) ? 'items-end' : 'items-start'"
				>
					<div
						class="px-4 py-2 rounded-2xl"
						:class="
							isSentByCurrentUser(message)
								? 'bg-primary text-primary-foreground rounded-br-sm'
								: 'bg-primary/10 text-primary rounded-bl-sm'
						"
					>
						<p class="text-base font-lateef wrap-break-word">
							{{ message.text }}
						</p>
					</div>

					<span class="text-xs font-lateef text-primary/50 mt-1 px-3">
						{{ formatMessageTime(message.sentAt) }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
