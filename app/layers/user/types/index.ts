import type { BaseEntity } from '~/core/types'

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
