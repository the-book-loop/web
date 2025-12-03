import { queryOptions } from '@tanstack/vue-query'
import { TECHNICAL_SUPPORT_QUERY_KEYS } from '../constants'
import type { SupportTicket } from '../types'

export const supportTicketOptions = (ticketId: MaybeRefOrGetter<string>) => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: TECHNICAL_SUPPORT_QUERY_KEYS.byId(ticketId),
		queryFn: async () => {
			const response = await $fetch<SupportTicket>(
				`/api/Support/${toValue(ticketId)}`,
				{
					baseURL: apiBaseUrl,
					headers: {
						Authorization: `Bearer ${tokenInfo.value?.token}`,
					},
				},
			)

			return response
		},
	})
}
