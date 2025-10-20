<script lang="ts" setup>
definePageMeta({
	layout: 'auth',
})

useSeoMeta({
	title: 'Sign Up',
})
</script>

<template>
	<div class="flex flex-col gap-4">
		<span class="space-y-2 mb-8">
			<h1
				class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl text-primary font-lateef m-0"
			>
				Welcome
			</h1>
			<p class="font-lateef text-primary text-xl">
				Create an account to join BookLoop
			</p>
		</span>
		<SignupForm />
		<span class="inline-flex gap-2 font-lateef text-xl">
			<p>Already have an account?</p>
			<NuxtLink class="uppercase font-bold hover:underline" to="/login">
				Sign in
			</NuxtLink>
		</span>
	</div>
</template>
