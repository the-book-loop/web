import { queryOptions } from '@tanstack/vue-query'
import { BOOKS_QUERY_KEYS } from '../constants'
import type { Book, GetAllBooksParams } from '../types'
import qs from 'qs'

export const allBooksOptions = (args: GetAllBooksParams) => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())
	const { query, condition, language, genre } = args

	return queryOptions({
		queryKey: computed(() => BOOKS_QUERY_KEYS.search(args)),
		queryFn: async () => {
			const filters: Record<string, string> = {}

			if (toValue(query)) {
				filters['Title'] = toValue(query)
			}

			if (toValue(condition) && toValue(condition) !== 'all') {
				filters['State'] = toValue(condition)
			}

			if (toValue(language) && toValue(language) !== 'all') {
				filters['Language'] = toValue(language)
			}

			if (toValue(genre) && toValue(genre) !== 'all') {
				filters['Genre'] = toValue(genre)
			}

			const stringifiedQuery = qs.stringify(filters)

			const books = await $fetch<Book[]>(`/api/Book?${stringifiedQuery}`, {
				baseURL: apiBaseUrl,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return books
		},
	})
}
