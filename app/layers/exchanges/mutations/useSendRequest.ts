import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateExchange, Exchange } from '../types'
import { EXCHANGES_QUEERY_KEYS } from '../constants'

export const useSendRequest = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo, user } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation({
		mutationFn: async (data: CreateExchange) => {
			const response = await $fetch<Exchange>(`/api/Exchange`, {
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
				queryKey: EXCHANGES_QUEERY_KEYS.sentByUser(
					user.value?.userId as string,
				),
			})

			router.replace('/exchanges')
		},
	})
}
