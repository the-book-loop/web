import { useQueryClient } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { ChatNotification } from '../types'

export const useChatState = () => {
	const queryClient = useQueryClient()
	const activeChatId = useState<string | null>('active-chat-id', () => null)
	const unreadCounts = useState<Record<string, number>>(
		'unread-counts',
		() => ({}),
	)

	const selectChat = (chatId: string) => {
		activeChatId.value = chatId
		if (unreadCounts.value[chatId]) {
			unreadCounts.value[chatId] = 0
		}
	}

	const clearActiveChat = () => {
		activeChatId.value = null
	}

	const handleIncomingMessage = (notification: ChatNotification) => {
		const { chatId } = notification

		queryClient.invalidateQueries({
			queryKey: CHATS_QUERY_KEYS.messages(chatId),
		})

		queryClient.invalidateQueries({
			queryKey: CHATS_QUERY_KEYS.byUser(),
		})

		if (activeChatId.value !== chatId) {
			unreadCounts.value[chatId] = (unreadCounts.value[chatId] || 0) + 1
		}
	}

	const getUnreadCount = (chatId: string) => {
		return unreadCounts.value[chatId] || 0
	}

	const getTotalUnreadCount = computed(() => {
		return Object.values(unreadCounts.value).reduce(
			(total, count) => total + count,
			0,
		)
	})

	const clearUnreadCount = (chatId: string) => {
		if (unreadCounts.value[chatId]) {
			unreadCounts.value[chatId] = 0
		}
	}

	return {
		activeChatId: readonly(activeChatId),
		unreadCounts: readonly(unreadCounts),
		selectChat,
		clearActiveChat,
		handleIncomingMessage,
		getUnreadCount,
		getTotalUnreadCount,
		clearUnreadCount,
	}
}
