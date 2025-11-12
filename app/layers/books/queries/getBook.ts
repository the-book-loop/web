import { queryOptions } from '@tanstack/vue-query'
import { BOOKS_QUERY_KEYS } from '../constants'
import type { Maybe } from '~/core/types'
import type { Book } from '../types'

export const bookOptions = (bookId: MaybeRefOrGetter<string>) => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: BOOKS_QUERY_KEYS.byId(bookId),
		queryFn: async () => {
			const book = await $fetch<Maybe<Book>>(`/api/Book/${toValue(bookId)}`, {
				method: 'GET',
				baseURL: apiBaseUrl,
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			// if (!book) {
			// 	throw createError({ statusCode: 404, statusMessage: 'Book not found' })
			// }

			return book
		},
	})
}
