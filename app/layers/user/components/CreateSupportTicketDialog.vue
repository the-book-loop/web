<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { useCreateSupportTicket } from '../mutations/useCreateSupportTicket'

const isOpen = ref(false)

const { mutateAsync, isPending } = useCreateSupportTicket()

const buttonText = computed(() => {
	return isPending.value ? 'Creating...' : 'Create'
})

const form = useForm({
	initialValues: {
		subject: '',
		message: '',
	},
})

const handleSubmit = form.handleSubmit(async (values) => {
	await mutateAsync(values, {
		onSuccess() {
			isOpen.value = false
			form.resetForm()
		},
	})
})
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<slot />
		</DialogTrigger>
		<DialogContent>
			<DialogTitle>Create a Support Ticket</DialogTitle>
			<form class="space-y-4" @submit="handleSubmit">
				<FormField v-slot="{ componentField }" name="subject">
					<FormItem>
						<FormLabel>Subject</FormLabel>
						<FormControl>
							<Input
								type="text"
								placeholder="Write a subject of your ticket"
								:disabled="isPending"
								v-bind="componentField"
							/>
						</FormControl>
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="message">
					<FormItem>
						<FormLabel>Message</FormLabel>
						<FormControl>
							<Textarea
								class="resize-none"
								placeholder="Describe your ticket..."
								:disabled="isPending"
								v-bind="componentField"
							/>
						</FormControl>
					</FormItem>
				</FormField>
				<Button :disabled="isPending">
					{{ buttonText }}
				</Button>
			</form>
		</DialogContent>
	</Dialog>
</template>
