import type { BaseEntity } from '~/core/types'

export type Exchange = BaseEntity<{
	bookId: string
	bookTitle: string
	ownerId: string
	ownerFirstName: string
	ownerLastName: string
	receiverId: string
	receiverFirstName: string
	receiverLastName: string
	status: number
	rating: number
	comment: string
}>

export type CreateExchange = {
	ownerId: string
	bookId: string
}

export type UpdateExchange = {
	exchangeId: string
	status: number
}
