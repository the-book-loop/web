import type { BaseEntity } from '~/core/types'

export type Review = BaseEntity<{
	exchangeId: string
	reviewerId: string
	reviewerFirstName: string
	reviewerLastName: string
	reviewerImg: string
	reviewedUserId: string
	reviewedUserFirstName: string
	reviewedUserLastName: string
	rating: number
	comment: string
}>
