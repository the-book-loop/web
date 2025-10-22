<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { useEditProfile } from '../mutations/useEditProfile'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { EditProfileSchema } from '../schemas'

const { user } = storeToRefs(useAuthStore())

const { mutateAsync, isPending } = useEditProfile()

const form = useForm({
	validationSchema: toTypedSchema(EditProfileSchema),
	initialValues: {
		firstName: user.value?.firstName || '',
		lastName: user.value?.lastName || '',
		email: user.value?.email || '',
		description: user.value?.description || '',
	},
})

const handleSubmit = form.handleSubmit(async (values) => {
	await mutateAsync(values, {
		onSuccess: () => {
			toast('Profile updated successfully')
		},
	})
})

const isDisabled = computed(() => {
	return (
		form.values.firstName === user.value?.firstName &&
		form.values.lastName === user.value?.lastName &&
		form.values.email === user.value?.email &&
		form.values.description === user.value?.description
	)
})

const buttonText = computed(() => {
	return isPending.value ? 'Changing...' : 'Change'
})
</script>

<template>
	<form class="w-full space-y-4" @submit="handleSubmit">
		<div class="grid grid-cols-2 gap-5">
			<FormField v-slot="{ componentField }" name="firstName">
				<FormItem>
					<FormLabel>First Name</FormLabel>
					<FormControl>
						<div class="relative">
							<Input
								class="pl-9"
								type="text"
								placeholder="Enter first name"
								v-bind="componentField"
								:disabled="isPending"
								autofocus
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
		<FormField v-slot="{ componentField }" name="description">
			<FormItem>
				<FormLabel>About you</FormLabel>
				<FormControl>
					<Textarea
						class="resize-none"
						placeholder="Tell us about yourself"
						:disabled="isPending"
						v-bind="componentField"
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<Button :disabled="isDisabled || isPending">{{ buttonText }}</Button>
	</form>
</template>
