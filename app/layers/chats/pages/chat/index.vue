<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { userChatsOptions } from '../../queries/getUserChats'
import { chatByIdOptions } from '../../queries/getChatById'
import { useSignalR } from '../../composables/useSignalR'
import { useChatState } from '../../composables/useChatState'

definePageMeta({
	middleware: ['logged-in'],
})

const { data: chats, isLoading } = useQuery(userChatsOptions())

const signalR = useSignalR()
const { activeChatId, selectChat, handleIncomingMessage } = useChatState()
const router = useRouter()
const route = useRoute()

const selectedChatId = computed(() => {
	return (route.query.chat as string) || activeChatId.value
})

const { data: selectedChat } = useQuery({
	...chatByIdOptions(computed(() => selectedChatId.value || '')),
	enabled: computed(() => !!selectedChatId.value),
})

const handleChatSelected = (chatId: string) => {
	selectChat(chatId)
	router.push({ query: { chat: chatId } })
}

onMounted(async () => {
	try {
		await signalR.connect()

		const unsubscribe = signalR.onReceiveMessage((notification) => {
			handleIncomingMessage(notification)
		})

		onUnmounted(() => {
			unsubscribe()
			signalR.disconnect()
		})
	} catch (error) {
		console.error('Failed to connect to SignalR:', error)
	}
})

watch(selectedChatId, async (newChatId, oldChatId) => {
	if (oldChatId && signalR.isConnected.value) {
		try {
			await signalR.leaveChat(oldChatId)
		} catch (error) {
			console.error('Failed to leave chat:', error)
		}
	}

	if (newChatId && signalR.isConnected.value) {
		try {
			await signalR.joinChat(newChatId)
		} catch (error) {
			console.error('Failed to join chat:', error)
		}
	}
})
</script>

<template>
	<div class="flex">
		<div
			class="w-full md:w-96 border-r border-primary/10 shrink-0"
			:class="{ 'hidden md:block': selectedChatId }"
		>
			<div v-if="isLoading" class="flex items-center justify-center h-full">
				<Icon name="lucide:loader-2" class="size-8 text-primary animate-spin" />
			</div>

			<ChatList
				v-else
				:chats="chats || []"
				:active-chat="selectedChatId"
				@chat-selected="handleChatSelected"
			/>
		</div>

		<div class="flex-1" :class="{ 'hidden md:block': !selectedChatId }">
			<ChatWindow :chat="selectedChat || null" />
		</div>
	</div>
</template>
