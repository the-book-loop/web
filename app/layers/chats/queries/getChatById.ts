import { queryOptions } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { ChatResponse } from '../types'

export const chatByIdOptions = (chatId: MaybeRefOrGetter<string>) => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: CHATS_QUERY_KEYS.byId(chatId),
		queryFn: async () => {
			const chat = await $fetch<ChatResponse>(`/api/Chat/${toValue(chatId)}`, {
				baseURL: apiBaseUrl,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return chat
		},
	})
}
