import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateSupportTicket, SupportTicket } from '../types'
import { TECHNICAL_SUPPORT_QUERY_KEYS } from '../constants'

export const useCreateSupportTicket = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: CreateSupportTicket) => {
			const response = await $fetch<SupportTicket>('/api/Support', {
				method: 'POST',
				baseURL: apiBaseUrl,
				body: data,
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return response
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: TECHNICAL_SUPPORT_QUERY_KEYS.all,
				exact: true,
			})
		},
	})
}
