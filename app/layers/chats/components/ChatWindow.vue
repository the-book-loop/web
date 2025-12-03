<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { chatMessagesOptions } from '../queries/getChatMessages'
import { useSendMessage } from '../mutations/useSendMessage'
import type { ChatResponse } from '../types'

const props = defineProps<{
	chat: ChatResponse | null
}>()

const { user } = storeToRefs(useAuthStore())
const sendMessageMutation = useSendMessage()

const limit = ref(50)
const offset = ref(0)

const { data: messages, isLoading } = useQuery({
	...chatMessagesOptions(
		computed(() => props.chat?.id || ''),
		limit,
		offset,
	),
	enabled: computed(() => !!props.chat?.id),
})

const handleSendMessage = async (text: string) => {
	if (!props.chat) return

	try {
		await sendMessageMutation.mutateAsync({
			chatId: props.chat.id,
			text,
		})
	} catch (error) {
		console.error('Failed to send message:', error)
	}
}

const handleLoadMore = () => {
	offset.value += limit.value
}
</script>

<template>
	<div v-if="chat" class="flex flex-col h-fit">
		<div
			class="flex items-center justify-between p-4 border-b border-primary/10 w-3xl"
		>
			<div class="flex items-center gap-3">
				<NuxtLink
					to="/chat"
					class="md:hidden flex items-center justify-center hover:bg-primary/10 rounded-full p-2"
				>
					<Icon name="lucide:arrow-left" class="size-5 text-primary" />
				</NuxtLink>

				<div
					class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
				>
					<span class="text-primary font-bold font-lateef text-sm">
						{{
							getOtherUser(chat, user?.userId).firstName.charAt(0) +
							getOtherUser(chat, user?.userId).lastName.charAt(0)
						}}
					</span>
				</div>

				<div>
					<h2 class="font-bold font-lateef text-primary">
						{{ getOtherUser(chat, user?.userId).firstName }}
						{{ getOtherUser(chat, user?.userId).lastName }}
					</h2>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon" title="More options">
					<Icon name="lucide:more-vertical" class="size-5 text-primary" />
				</Button>
			</div>
		</div>

		<ChatMessages
			:messages="messages || []"
			:current-user-id="user?.userId || ''"
			:is-loading="isLoading"
			@load-more="handleLoadMore"
		/>

		<ChatInput
			:disabled="sendMessageMutation.isPending.value"
			@send="handleSendMessage"
		/>
	</div>

	<div v-else class="flex items-center justify-center h-full">
		<div class="text-center pt-12">
			<Icon
				name="lucide:messages-square"
				class="size-24! text-primary/30 mx-auto"
			/>
			<h3 class="text-2xl font-bold font-lateef text-primary mb-2">
				Select a conversation
			</h3>
			<p class="text-lg font-lateef text-primary/50">
				Choose a chat from the list to start messaging
			</p>
		</div>
	</div>
</template>
