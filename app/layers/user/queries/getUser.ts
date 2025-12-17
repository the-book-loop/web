import { queryOptions } from '@tanstack/vue-query'
import { USERS_QUERY_KEYS } from '../constants'
import type { UserProfile } from '../types'

export const userOptions = (userId: MaybeRefOrGetter<string>) => {
	return queryOptions({
		queryKey: USERS_QUERY_KEYS.byId(userId),
		queryFn: async () => {
			const { tokenInfo } = storeToRefs(useAuthStore())
			const {
				public: { apiBaseUrl },
			} = useRuntimeConfig()

			const user = await $fetch<UserProfile>(
				`/api/UserProfile/${toValue(userId)}`,
				{
					baseURL: apiBaseUrl,
					headers: {
						Authorization: `Bearer ${tokenInfo.value?.token}`,
					},
				},
			)

			return user
		},
	})
}
