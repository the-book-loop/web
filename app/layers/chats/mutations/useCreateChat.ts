import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { ChatResponse, CreateChatRequest } from '../types'

export const useCreateChat = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: CreateChatRequest) => {
			const response = await $fetch<ChatResponse>('/api/Chat', {
				baseURL: apiBaseUrl,
				method: 'POST',
				body: data,
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return response
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: CHATS_QUERY_KEYS.byUser(),
			})
		},
	})
}
