import type { ChatResponse, MessageResponse } from '../types'

export const getOtherUser = (chat: ChatResponse, currentUserId?: string) => {
	if (chat.userId1 === currentUserId) {
		return {
			id: chat.userId2,
			firstName: chat.user2FirstName,
			lastName: chat.user2LastName,
		}
	}
	return {
		id: chat.userId1,
		firstName: chat.user1FirstName,
		lastName: chat.user1LastName,
	}
}

export const getInitials = (firstName: string, lastName: string) => {
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export const formatTimestamp = (dateString: string) => {
	const date = new Date(dateString)
	const now = new Date()
	const diffInMs = now.getTime() - date.getTime()
	const diffInMinutes = Math.floor(diffInMs / 60000)
	const diffInHours = Math.floor(diffInMinutes / 60)
	const diffInDays = Math.floor(diffInHours / 24)

	if (diffInMinutes < 1) return 'Just now'
	if (diffInMinutes < 60) return `${diffInMinutes}m ago`
	if (diffInHours < 24) return `${diffInHours}h ago`
	if (diffInDays === 1) return 'Yesterday'
	if (diffInDays < 7) return `${diffInDays}d ago`

	return date.toLocaleDateString()
}

export const truncateText = (text: string, maxLength: number = 50) => {
	if (text.length <= maxLength) return text
	return text.substring(0, maxLength) + '...'
}

export const formatMessageTime = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	})
}

export const isSentByCurrentUser = (
	message: MessageResponse,
	currentUserId: string,
) => {
	return message.senderId === currentUserId
}

export const groupMessagesByDate = (messages: MessageResponse[]) => {
	const groups: Array<{
		date: string
		messages: MessageResponse[]
	}> = []

	messages.forEach((message) => {
		const messageDate = new Date(message.sentAt).toLocaleDateString()
		const existingGroup = groups.find((g) => g.date === messageDate)

		if (existingGroup) {
			existingGroup.messages.push(message)
		} else {
			groups.push({
				date: messageDate,
				messages: [message],
			})
		}
	})

	return groups
}

export const formatGroupDate = (dateString: string) => {
	const date = new Date(dateString)
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	if (date.toDateString() === today.toDateString()) return 'Today'
	if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
	})
}
