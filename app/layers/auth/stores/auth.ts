import { defineStore } from 'pinia'
import type { Maybe } from '~/core/types'
import type { TokenInfo, User } from '../types'
import type { Profile } from '~/layers/user/schemas'

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

		const updateProfile = (profile: Profile) => {
			user.value = { ...user.value, ...profile } as User
		}

		return {
			tokenInfo,
			user,
			isAuthenticated,
			invalidateSession,
			updateProfile,
		}
	},
	{ persist: true },
)
