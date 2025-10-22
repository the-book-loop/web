import { useMutation } from '@tanstack/vue-query'
import type { Profile } from '../schemas'

export const useEditProfile = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const authStore = useAuthStore()

	return useMutation({
		mutationFn: async (data: Profile) => {
			await $fetch<Profile>('/api/Auth/profile', {
				baseURL: apiBaseUrl,
				method: 'PUT',
				body: data,
				headers: {
					Authorization: `Bearer ${authStore.tokenInfo?.token}`,
				},
			})
		},
		onSuccess: (_, vars) => {
			authStore.updateProfile(vars)
		},
	})
}
