<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { SignupSchema } from '../schemas'
import { useSignup } from '../mutations/useSignup'

const form = useForm({
	validationSchema: toTypedSchema(SignupSchema),
	initialValues: {
		timeZone: 'Europe/Kyiv',
		location: 'Ukraine',
	},
})

const { mutateAsync, isPending, error, isError } = useSignup()

const handleSubmit = form.handleSubmit(async (values) => {
	await mutateAsync(values, {
		onSuccess: () => {
			form.resetForm()
		},
	})
})

const buttonText = computed(() =>
	isPending.value ? 'Creating account...' : 'Signup',
)
</script>

<template>
	<form class="w-md space-y-4" @submit="handleSubmit">
		<div class="grid grid-cols-2 gap-4">
			<FormField v-slot="{ componentField }" name="firstName">
				<FormItem>
					<FormLabel>First Name</FormLabel>
					<FormControl>
						<div class="relative">
							<Input
								class="pl-9"
								type="text"
								placeholder="Enter first name"
								:disabled="isPending"
								autofocus
								v-bind="componentField"
							/>
							<span
								class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
							>
								<Icon name="lucide:user-round" />
							</span>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
			<FormField v-slot="{ componentField }" name="lastName">
				<FormItem>
					<FormLabel>Last Name</FormLabel>
					<FormControl>
						<div class="relative">
							<Input
								class="pl-9"
								type="text"
								placeholder="Enter last name"
								:disabled="isPending"
								v-bind="componentField"
							/>
							<span
								class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
							>
								<Icon name="lucide:user-round" />
							</span>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
		</div>
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
