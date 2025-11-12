import { queryOptions } from '@tanstack/vue-query'
import { BOOKS_QUERY_KEYS } from '../constants'
import type { Book } from '../types'

export const userBooksOptions = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { user, tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: BOOKS_QUERY_KEYS.byUser(user.value?.userId as string),
		queryFn: async () => {
			const books = await $fetch<Book[]>(
				`/api/Book?ownerId=${user.value?.userId}`,
				{
					baseURL: apiBaseUrl,
					method: 'GET',
					headers: {
						Authorization: `Bearer ${tokenInfo.value?.token}`,
					},
				},
			)

			return books
		},
	})
}
