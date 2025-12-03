<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { chatByIdOptions } from '../../queries/getChatById'
import { useSignalR } from '../../composables/useSignalR'

definePageMeta({
	middleware: ['logged-in'],
})

const route = useRoute()
const chatId = computed(() => route.params.id as string)

const { data: chat, isLoading } = useQuery(chatByIdOptions(chatId))

const signalR = useSignalR()
const { selectChat, handleIncomingMessage } = useChatState()

onMounted(async () => {
	if (chatId.value) {
		selectChat(chatId.value)
	}

	try {
		await signalR.connect()

		const unsubscribe = signalR.onReceiveMessage((notification) => {
			handleIncomingMessage(notification)
		})

		if (chatId.value && signalR.isConnected.value) {
			await signalR.joinChat(chatId.value)
		}

		onUnmounted(async () => {
			unsubscribe()

			if (chatId.value && signalR.isConnected.value) {
				try {
					await signalR.leaveChat(chatId.value)
				} catch (error) {
					console.error('Failed to leave chat:', error)
				}
			}

			signalR.disconnect()
		})
	} catch (error) {
		console.error('Failed to connect to SignalR:', error)
	}
})
</script>

<template>
	<div class="h-[calc(100vh-4rem)]">
		<div v-if="isLoading" class="flex items-center justify-center h-full">
			<Icon name="lucide:loader-2" class="size-8 text-primary animate-spin" />
		</div>

		<div v-else-if="!chat" class="flex items-center justify-center h-full">
			<div class="text-center">
				<Icon
					name="lucide:message-square-x"
					class="size-16 text-primary/30 mx-auto mb-4"
				/>
				<h3 class="text-2xl font-bold font-lateef text-primary mb-2">
					Chat not found
				</h3>
				<p class="text-lg font-lateef text-primary/50 mb-4">
					This chat doesn't exist or you don't have access to it
				</p>
				<NuxtLink
					to="/chat"
					class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					<Icon name="lucide:arrow-left" class="size-4" />
					Back to chats
				</NuxtLink>
			</div>
		</div>

		<ChatWindow v-else :chat="chat" />
	</div>
</template>
