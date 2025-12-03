export interface ChatResponse {
	id: string
	userId1: string
	user1FirstName: string
	user1LastName: string
	userId2: string
	user2FirstName: string
	user2LastName: string
	exchangeId: string | null
	lastMessage: MessageResponse | null
	created: string
	modified: string
}

export interface MessageResponse {
	id: string
	chatId: string
	senderId: string
	senderFirstName: string
	senderLastName: string
	text: string
	sentAt: string
	created: string
}

export interface CreateChatRequest {
	exchangeId: string
}

export interface SendMessageRequest {
	chatId: string
	text: string
}

export interface ChatNotification {
	chatId: string
	message: MessageResponse
}
