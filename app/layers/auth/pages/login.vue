<script lang="ts" setup>
definePageMeta({
	layout: 'auth',
	middleware: ['guest-only'],
})

useSeoMeta({
	title: 'Login',
})
</script>

<template>
	<div class="flex flex-col gap-4">
		<span class="space-y-2 mb-8">
			<h1
				class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl text-primary font-lateef m-0"
			>
				Welcome back!
			</h1>
			<p class="font-lateef text-primary text-xl">
				Please log in on the website to continue
			</p>
		</span>
		<LoginForm />
		<span class="inline-flex gap-2 font-lateef text-xl">
			<p>Don't have an account?</p>
			<NuxtLink class="uppercase font-bold hover:underline" to="/signup">
				Sign up
			</NuxtLink>
		</span>
	</div>
</template>
