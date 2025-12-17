import type { BaseEntity } from '~/core/types'
import type { User } from '~/layers/auth/types'
import type { Book } from '~/layers/books/types'
import type { Review } from '~/layers/reviews/types'

export type SupportTicket = BaseEntity<{
	respondedAt: Date | null
	userId: string
	userFirstName: string
	userLastName: string
	userEmail: string
	subject: string
	message: string
	status: 0 | 1 | 2
	adminResponse: string | null
}>

export type CreateSupportTicket = Pick<SupportTicket, 'subject' | 'message'>

export type UserProfile = User & {
	averageRating: number
	totalReviews: number
	completedExchanges: number
	books: Book[]
	reviews: Review[]
}
