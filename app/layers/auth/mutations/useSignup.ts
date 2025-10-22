import { useMutation } from '@tanstack/vue-query'
import type { SignupData } from '../schemas'
import type { AuthResponse } from '../types'

export const useSignup = () => {
	const router = useRouter()
	const store = useAuthStore()

	return useMutation({
		mutationFn: async (data: SignupData) => {
			try {
				const {
					public: { apiBaseUrl },
				} = useRuntimeConfig()

				const response = await $fetch<AuthResponse>('/api/Auth/register', {
					baseURL: apiBaseUrl,
					method: 'POST',
					body: data,
				})

				return response
			} catch (e) {
				// @ts-expect-error error object isn't typed
				throw new Error(e.data.error)
			}
		},
		onSuccess: (data) => {
			const { token, expiresAt, ...rest } = data

			store.tokenInfo = {
				token,
				expiresAt,
			}

			store.user = { ...rest }

			router.replace('/')
		},
	})
}
