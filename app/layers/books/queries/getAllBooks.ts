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

			addFilters(filters, {
				Title: query,
				State: condition,
				Language: language,
				Genre: genre,
			})

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
