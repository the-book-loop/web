import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { BOOKS_QUERY_KEYS } from '../constants'
import type { Book } from '../types'

export const useDeleteBook = (bookId: MaybeRefOrGetter<string>) => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo, user } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation({
		mutationFn: async () => {
			const response = await $fetch<Book>(`/api/Book/${toValue(bookId)}`, {
				baseURL: apiBaseUrl,
				method: 'DELETE',
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
