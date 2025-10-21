import { defineStore } from 'pinia'
import type { Maybe } from '~/core/types'
import type { TokenInfo, User } from '../types'

export const useAuthStore = defineStore(
	'auth',
	() => {
		const tokenInfo = ref<Maybe<TokenInfo>>(null)
		const user = ref<Maybe<User>>(null)

		const isAuthenticated = computed(() => !!tokenInfo.value)

		const invalidateSession = () => {
			tokenInfo.value = null
			user.value = null
		}

		return {
			tokenInfo,
			user,
			isAuthenticated,
			invalidateSession,
		}
	},
	{ persist: true },
)
