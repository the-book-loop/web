import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { MessageResponse, SendMessageRequest } from '../types'

export const useSendMessage = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo, user } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ chatId, text }: { chatId: string; text: string }) => {
			const response = await $fetch<MessageResponse>(
				`/api/Chat/${chatId}/message`,
				{
					baseURL: apiBaseUrl,
					method: 'POST',
					body: { chatId, text } as SendMessageRequest,
					headers: {
						Authorization: `Bearer ${tokenInfo.value?.token}`,
					},
				},
			)

			return response
		},
		onMutate: async ({ chatId, text }) => {
			const tempMessage: MessageResponse = {
				id: `temp-${Date.now()}`,
				chatId,
				senderId: user.value?.userId || '',
				senderFirstName: '',
				senderLastName: '',
				text,
				sentAt: new Date().toISOString(),
				created: new Date().toISOString(),
			}

			await queryClient.cancelQueries({
				queryKey: CHATS_QUERY_KEYS.messages(chatId),
			})

			const previousMessages = queryClient.getQueryData(
				CHATS_QUERY_KEYS.messages(chatId),
			)

			queryClient.setQueryData(
				CHATS_QUERY_KEYS.messages(chatId),
				(old: MessageResponse[] = []) => [...old, tempMessage],
			)

			return { previousMessages, chatId }
		},
		onError: (err, variables, context) => {
			if (context?.previousMessages) {
				queryClient.setQueryData(
					CHATS_QUERY_KEYS.messages(context.chatId),
					context.previousMessages,
				)
			}
		},
		onSuccess: async (_, { chatId }) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: CHATS_QUERY_KEYS.messages(chatId),
				}),
				queryClient.invalidateQueries({
					queryKey: CHATS_QUERY_KEYS.byUser(),
				}),
			])
		},
	})
}
