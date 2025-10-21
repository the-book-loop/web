<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { LoginSchema } from '../schemas'
import { useLogin } from '../mutations/useLogin'

const form = useForm({
	validationSchema: toTypedSchema(LoginSchema),
})

const { mutateAsync, isPending, isError, error } = useLogin()

const handleSubmit = form.handleSubmit(async (values) => {
	await mutateAsync(values, {
		onSuccess: () => {
			form.resetForm()
		},
	})
})

const buttonText = computed(() => (isPending.value ? 'Logging in...' : 'Login'))
</script>

<template>
	<form class="w-md space-y-4" @submit="handleSubmit">
		<FormField v-slot="{ componentField }" name="email">
			<FormItem>
				<FormLabel>Email</FormLabel>
				<FormControl>
					<div class="relative">
						<Input
							class="pl-9"
							type="email"
							placeholder="Enter email"
							:disabled="isPending"
							v-bind="componentField"
							autofocus
						/>
						<span
							class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
						>
							<Icon name="lucide:mail" />
						</span>
					</div>
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<FormField v-slot="{ componentField }" name="password">
			<FormItem>
				<FormLabel>Password</FormLabel>
				<FormControl>
					<div class="relative">
						<Input
							class="pl-9"
							type="password"
							placeholder="Enter password"
							:disabled="isPending"
							v-bind="componentField"
						/>
						<span
							class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
						>
							<Icon name="lucide:key-round" />
						</span>
					</div>
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<p v-show="isError" class="text-destructive">{{ error?.message }}</p>
		<Button :disabled="isPending">{{ buttonText }}</Button>
	</form>
</template>
