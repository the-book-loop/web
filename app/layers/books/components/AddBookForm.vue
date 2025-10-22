<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { CreateBookSchema } from '../schemas'
import { BOOK_STATES } from '../constans'
import { capitalize } from 'vue'
import { useAddBook } from '../mutations/useAddBook'

const { mutateAsync, isPending } = useAddBook()

const form = useForm({
	validationSchema: toTypedSchema(CreateBookSchema),
})

const handleSubmit = form.handleSubmit(async (values) => {
	await mutateAsync(values, {
		onSuccess: () => {
			form.resetForm()
		},
	})
})

const bookStates = computed(() => {
	return BOOK_STATES.map((state) => {
		const [first, second] = state.split('_')

		return {
			value: state,
			label: `${capitalize(first!)} ${second ? capitalize(second) : ''}`.trim(),
		}
	})
})

const buttonText = computed(() => (isPending.value ? 'Adding...' : 'Add'))
</script>

<template>
	<form class="space-y-4" @submit="handleSubmit">
		<FormField v-slot="{ componentField }" name="title">
			<FormItem>
				<FormLabel>Title</FormLabel>
				<FormControl>
					<Input
						placeholder="Write a book title"
						type="text"
						v-bind="componentField"
						:disabled="isPending"
						autofocus
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<div class="grid grid-cols-2 gap-2">
			<FormField v-slot="{ componentField }" name="state">
				<FormItem>
					<FormLabel>State</FormLabel>
					<FormControl>
						<Select v-bind="componentField" :disabled="isPending">
							<SelectTrigger class="w-full">
								<SelectValue placeholder="Select a book state" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									v-for="({ label, value }, i) in bookStates"
									:key="i"
									:value
								>
									{{ label }}
								</SelectItem>
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
			<FormField v-slot="{ componentField }" name="genre">
				<FormItem>
					<FormLabel>Genre</FormLabel>
					<FormControl>
						<Input
							placeholder="Write a book title"
							type="text"
							v-bind="componentField"
							:disabled="isPending"
							autofocus
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
		</div>
		<FormField v-slot="{ componentField }" name="description">
			<FormItem>
				<FormLabel>Description</FormLabel>
				<FormControl>
					<Textarea
						class="resize-none"
						placeholder="Write a book description"
						v-bind="componentField"
						:disabled="isPending"
						autofocus
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<div class="grid grid-cols-2 gap-2">
			<FormField v-slot="{ componentField }" name="author">
				<FormItem>
					<FormLabel>Author</FormLabel>
					<FormControl>
						<Input
							placeholder="Write a book author"
							type="text"
							v-bind="componentField"
							:disabled="isPending"
							autofocus
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
			<FormField v-slot="{ componentField }" name="language">
				<FormItem>
					<FormLabel>Language</FormLabel>
					<FormControl>
						<Input
							placeholder="Write a book language"
							type="text"
							v-bind="componentField"
							:disabled="isPending"
							autofocus
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
		</div>
		<Button :disabled="isPending">
			<Icon name="lucide:plus" />
			{{ buttonText }}
		</Button>
	</form>
</template>
