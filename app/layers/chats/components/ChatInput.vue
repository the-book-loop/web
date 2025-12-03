<script lang="ts" setup>
const props = defineProps<{
	disabled?: boolean
	maxLength?: number
}>()

const emit = defineEmits<{
	send: [text: string]
}>()

const messageText = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const maxLen = computed(() => props.maxLength || 1000)
const remainingChars = computed(() => maxLen.value - messageText.value.length)
const isOverLimit = computed(() => messageText.value.length > maxLen.value)
const canSend = computed(
	() =>
		messageText.value.trim().length > 0 &&
		!isOverLimit.value &&
		!props.disabled,
)

const adjustTextareaHeight = () => {
	if (!textareaRef.value) return

	textareaRef.value.style.height = 'auto'
	const newHeight = Math.min(textareaRef.value.scrollHeight, 120)
	textareaRef.value.style.height = `${newHeight}px`
}

const handleInput = () => {
	adjustTextareaHeight()
}

const handleSend = () => {
	if (!canSend.value) return

	const text = messageText.value.trim()
	if (text) {
		emit('send', text)
		messageText.value = ''
		nextTick(() => {
			adjustTextareaHeight()
			textareaRef.value?.focus()
		})
	}
}

const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault()
		handleSend()
	}
}

onMounted(() => {
	adjustTextareaHeight()
})
</script>

<template>
	<div class="border-t border-primary/10 p-4 w-3xl">
		<div class="flex items-end gap-2">
			<div class="flex-1 relative">
				<textarea
					ref="textareaRef"
					v-model="messageText"
					:disabled="disabled"
					:placeholder="disabled ? 'Connecting...' : 'Type a message...'"
					class="w-full px-4 py-2 pr-16 resize-none rounded-2xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed font-lateef text-primary bg-background"
					rows="1"
					@input="handleInput"
					@keydown="handleKeydown"
				></textarea>

				<div
					class="absolute bottom-2 right-3 text-xs font-lateef"
					:class="isOverLimit ? 'text-destructive' : 'text-primary/40'"
				>
					{{ remainingChars }}
				</div>
			</div>

			<button
				:disabled="!canSend"
				class="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				@click="handleSend"
			>
				<Icon name="lucide:send" class="size-5" />
			</button>
		</div>

		<p v-if="isOverLimit" class="text-xs text-destructive mt-2 font-lateef">
			Message is too long. Maximum {{ maxLen }} characters allowed.
		</p>
	</div>
</template>
