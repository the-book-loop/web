import { queryOptions } from '@tanstack/vue-query'
import { EXCHANGES_QUEERY_KEYS } from '../constants'
import type { Exchange } from '../types'

export const receivedExchangesOptions = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { user, tokenInfo } = storeToRefs(useAuthStore())

	console.log(user.value)

	return queryOptions({
		queryKey: EXCHANGES_QUEERY_KEYS.recievedByUser(
			user.value?.userId as string,
		),
		queryFn: async () => {
			const exchanges = await $fetch<Exchange[]>(
				`/api/Exchange?OwnerId=${user.value?.userId as string}`,
				{
					method: 'GET',
					baseURL: apiBaseUrl,
					headers: {
						Authorization: `Bearer ${tokenInfo.value?.token}`,
					},
				},
			)

			return exchanges
		},
	})
}
