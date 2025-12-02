import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { EXCHANGES_QUEERY_KEYS } from '../constants'
import type { Exchange } from '../types'

export const useCancelExchange = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo, user } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation({
		mutationFn: async (exchangeId: string) => {
			await $fetch<Exchange>(`/api/Exchange/${exchangeId}`, {
				baseURL: apiBaseUrl,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: EXCHANGES_QUEERY_KEYS.recievedByUser(
					user.value?.userId as string,
				),
			})

			await queryClient.invalidateQueries({
				queryKey: EXCHANGES_QUEERY_KEYS.sentByUser(
					user.value?.userId as string,
				),
			})

			router.replace('/exchanges')
		},
	})
}
