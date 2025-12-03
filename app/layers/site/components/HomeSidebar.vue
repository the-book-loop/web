<script lang="ts" setup>
const links = [
	{ to: '/', icon: 'custom:heart', label: 'Home' },
	{ to: '/exchanges', icon: 'custom:exchange', label: 'Exchanges' },
	{ to: '/chat', icon: 'custom:messages', label: 'Chats' },
	{ to: '/search', icon: 'lucide:search', label: 'Search' },
	{ to: '/profile', icon: 'custom:user', label: 'Profile' },
]
</script>

<template>
	<div
		class="flex flex-col gap-6 *:font-lateef text-2xl text-primary/50 font-bold"
	>
		<NuxtLink
			v-for="({ to, icon, label }, i) in links"
			:key="i"
			active-class="text-primary"
			class="inline-flex gap-3 items-center"
			:to
		>
			<Icon :name="icon" class="size-6!" />
			<p class="leading-none">{{ label }}</p>
		</NuxtLink>
	</div>
</template>
