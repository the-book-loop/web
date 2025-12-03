import { queryOptions } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { MessageResponse } from '../types'

export const chatMessagesOptions = (
	chatId: MaybeRefOrGetter<string>,
	limit: MaybeRefOrGetter<number> = 100,
	offset: MaybeRefOrGetter<number> = 0,
) => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: CHATS_QUERY_KEYS.messagesPaginated(chatId, limit, offset),
		queryFn: async () => {
			const messages = await $fetch<MessageResponse[]>(
				`/api/Chat/${toValue(chatId)}/messages`,
				{
					baseURL: apiBaseUrl,
					method: 'GET',
					query: {
						limit: toValue(limit),
						offset: toValue(offset),
					},
					headers: {
						Authorization: `Bearer ${tokenInfo.value?.token}`,
					},
				},
			)

			return messages
		},
	})
}
