import { queryOptions } from '@tanstack/vue-query'
import { BOOKS_QUERY_KEYS } from '../constants'

export const booksLanguagesOptions = () => {
	return queryOptions({
		queryKey: BOOKS_QUERY_KEYS.languages(),
		queryFn: async () => {
			const {
				public: { apiBaseUrl },
			} = useRuntimeConfig()
			const { tokenInfo } = storeToRefs(useAuthStore())

			const languages = await $fetch<{ name: string }[]>('/api/Language', {
				method: 'GET',
				baseURL: apiBaseUrl,
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return languages
		},
	})
}
