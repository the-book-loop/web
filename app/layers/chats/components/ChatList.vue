<script lang="ts" setup>
import type { ChatResponse } from '../types'
import { useChatState } from '../composables/useChatState'

defineProps<{
	chats: ChatResponse[]
	activeChat: string | null
}>()

const emit = defineEmits<{
	chatSelected: [chatId: string]
}>()

const { user } = storeToRefs(useAuthStore())
const { getUnreadCount } = useChatState()
</script>

<template>
	<div class="flex flex-col h-full">
		<div
			v-if="chats.length === 0"
			class="flex-1 flex items-center justify-center p-8"
		>
			<div class="text-center">
				<Icon
					name="lucide:message-square"
					class="size-16 text-primary/30 mx-auto mb-4"
				/>
				<p class="text-lg font-lateef text-primary/50">No chats yet</p>
			</div>
		</div>

		<div v-else class="flex-1 overflow-y-auto">
			<div
				v-for="chat in chats"
				:key="chat.id"
				class="p-4 border-b border-primary/10 cursor-pointer hover:bg-primary/5 transition-colors"
				:class="{ 'bg-primary/10': activeChat === chat.id }"
				@click="emit('chatSelected', chat.id)"
			>
				<div class="flex items-start gap-3">
					<div
						class="shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
					>
						<span class="text-primary font-bold font-lateef">
							{{
								getInitials(
									getOtherUser(chat, user?.userId).firstName,
									getOtherUser(chat, user?.userId).lastName,
								)
							}}
						</span>
					</div>

					<div class="flex-1 min-w-0">
						<div class="flex items-center justify-between mb-1">
							<h3 class="font-bold font-lateef text-primary truncate">
								{{ getOtherUser(chat, user?.userId).firstName }}
								{{ getOtherUser(chat, user?.userId).lastName }}
							</h3>
							<span
								v-if="chat.lastMessage"
								class="text-sm font-lateef text-primary/50 shrink-0 ml-2"
							>
								{{ formatTimestamp(chat.lastMessage.sentAt) }}
							</span>
						</div>

						<div class="flex items-center justify-between">
							<p
								v-if="chat.lastMessage"
								class="text-sm font-lateef text-primary/70 truncate"
							>
								{{ truncateText(chat.lastMessage.text) }}
							</p>
							<p v-else class="text-sm font-lateef text-primary/50 italic">
								No messages yet
							</p>

							<span
								v-if="getUnreadCount(chat.id) > 0"
								class="shrink-0 ml-2 min-w-5 h-5 px-1.5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold"
							>
								{{ getUnreadCount(chat.id) }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
