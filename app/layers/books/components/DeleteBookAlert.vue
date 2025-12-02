<script lang="ts" setup>
import { useDeleteBook } from '../mutations/useDeleteBook'

const props = defineProps<{ bookId: string }>()

const { mutate, isPending } = useDeleteBook(() => props.bookId)

const buttonText = computed(() =>
	isPending.value ? 'Deleting...' : 'Continue',
)
</script>

<template>
	<AlertDialog>
		<AlertDialogTrigger as-child>
			<slot />
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete the book
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<Button variant="destructive" :disabled="isPending" @click="mutate">
					{{ buttonText }}
				</Button>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>
