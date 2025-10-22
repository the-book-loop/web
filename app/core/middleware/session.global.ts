export default defineNuxtRouteMiddleware(() => {
	const authStore = useAuthStore()
	const { tokenInfo, isAuthenticated } = storeToRefs(authStore)

	if (
		isAuthenticated.value &&
		new Date(tokenInfo.value?.expiresAt) < new Date()
	) {
		authStore.invalidateSession()

		return navigateTo('/login', { replace: true })
	}
})
