import { useMutation } from '@tanstack/vue-query'
import type { LoginData } from '../schemas'
import type { AuthResponse } from '../types'

export const useLogin = () => {
	const router = useRouter()
	const store = useAuthStore()

	return useMutation({
		mutationFn: async (data: LoginData) => {
			try {
				const {
					public: { apiBaseUrl },
				} = useRuntimeConfig()

				const response = await $fetch<AuthResponse>(`/api/Auth/login`, {
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

			store.user = rest
			store.tokenInfo = { token, expiresAt }

			router.replace('/')
		},
	})
}
