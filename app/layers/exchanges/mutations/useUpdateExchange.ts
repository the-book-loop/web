import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { EXCHANGES_QUEERY_KEYS } from '../constants'
import type { Exchange, UpdateExchange } from '../types'

export const useUpdateExchange = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo, user } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation({
		mutationFn: async ({ exchangeId, status }: UpdateExchange) => {
			const response = await $fetch<Exchange>(`/api/Exchange/${exchangeId}`, {
				baseURL: apiBaseUrl,
				method: 'PUT',
				body: {
					status: status,
				},
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return response
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: EXCHANGES_QUEERY_KEYS.recievedByUser(
					user.value?.userId as string,
				),
			})

			router.replace('/exchanges')
		},
	})
}
