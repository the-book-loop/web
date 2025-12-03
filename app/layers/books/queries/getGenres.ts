import { queryOptions } from '@tanstack/vue-query'
import { BOOKS_QUERY_KEYS } from '../constants'

export const booksGenresOptions = () => {
	return queryOptions({
		queryKey: BOOKS_QUERY_KEYS.genres(),
		queryFn: async () => {
			const {
				public: { apiBaseUrl },
			} = useRuntimeConfig()
			const { tokenInfo } = storeToRefs(useAuthStore())

			const genres = await $fetch<{ name: string }[]>('/api/Genre', {
				method: 'GET',
				baseURL: apiBaseUrl,
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return genres
		},
	})
}
