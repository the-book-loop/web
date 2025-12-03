<script lang="ts" setup>
definePageMeta({
	middleware: ['logged-in'],
})

useSeoMeta({
	title: 'Profile',
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()

const handleLogout = () => {
	authStore.invalidateSession()

	router.replace('/login')
}

const fullName = computed(() => {
	return `${user.value?.firstName} ${user.value?.lastName}`
})
</script>

<template>
	<div class="flex flex-col h-fit w-full gap-4">
		<div>
			<h1 class="text-3xl font-bold text-primary font-lateef">
				{{ fullName }}
			</h1>
			<div
				class="inline-flex gap-2 items-center font-lateef text-xl text-primary/50"
			>
				<Icon name="lucide:map-pin" class="size-4!" />
				Somewhere, Earth
			</div>
		</div>
		<div class="flex flex-col w-2xl bg-white rounded-lg p-4">
			<h2 class="font-lateef text-2xl font-bold text-primary">Bio</h2>
			<p class="font-lateef text-xl text-primary/50">{{ user?.description }}</p>
		</div>
		<div class="grid grid-cols-2 w-2xl gap-5">
			<Collapsible class="bg-white p-4 h-fit rounded-lg group/collapsible">
				<CollapsibleTrigger
					class="inline-flex font-lateef text-2xl font-bold text-primary items-center justify-between w-full"
				>
					Activities
					<Icon
						name="lucide:chevron-down"
						class="transition-transform group-data-[state=open]/collapsible:rotate-180"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<NuxtLink
						to="/profile/books"
						class="flex font-lateef text-xl items-center gap-2 text-primary/50"
					>
						<Icon name="lucide:book" class="size-3!" />
						My books
					</NuxtLink>
				</CollapsibleContent>
			</Collapsible>
			<Collapsible class="bg-white p-4 h-fit rounded-lg group/collapsible">
				<CollapsibleTrigger
					class="inline-flex font-lateef text-2xl font-bold text-primary items-center justify-between w-full"
				>
					Settings
					<Icon
						name="lucide:chevron-down"
						class="transition-transform group-data-[state=open]/collapsible:rotate-180"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<NuxtLink
						class="flex font-lateef text-xl items-center gap-2 text-primary/50"
						to="/profile/support"
					>
						<Icon name="lucide:headset" class="size-3!" />
						Technical support
					</NuxtLink>
					<NuxtLink
						class="flex font-lateef text-xl items-center gap-2 text-primary/50"
						to="/profile/edit"
					>
						<Icon name="lucide:pen-line" class="size-3!" />
						Edit profile
					</NuxtLink>
					<button
						class="flex font-lateef text-xl items-center gap-2 text-primary/50 cursor-pointer"
						@click="handleLogout"
					>
						<Icon name="lucide:log-out" class="size-3!" />
						Logout
					</button>
				</CollapsibleContent>
			</Collapsible>
		</div>
	</div>
</template>
