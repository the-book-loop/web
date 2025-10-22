import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateBook } from '../schemas'
import { BOOKS_QUERY_KEYS } from '../constans'
import type { Book } from '../types'

export const useAddBook = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo, user } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation({
		mutationFn: async (data: CreateBook) => {
			const response = await $fetch<Book>(`/api/Book`, {
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
				queryKey: BOOKS_QUERY_KEYS.byUser(user.value?.userId as string),
			})

			router.replace('/profile/books')
		},
	})
}
