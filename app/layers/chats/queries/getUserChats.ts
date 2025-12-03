import { queryOptions } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { ChatResponse } from '../types'

export const userChatsOptions = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: CHATS_QUERY_KEYS.byUser(),
		queryFn: async () => {
			const chats = await $fetch<ChatResponse[]>('/api/Chat', {
				baseURL: apiBaseUrl,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return chats
		},
	})
}
