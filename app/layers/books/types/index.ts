import type { BaseEntity } from '~/core/types'

export type Book = BaseEntity<{
	title: string
	author: string
	language: string
	description: string
	state: string
	genre: string
	ownerId: string
	ownerFirstName: string
	ownerLastName: string
}>

export interface GetAllBooksParams {
	query: MaybeRefOrGetter<string>
	condition: MaybeRefOrGetter<string>
	language: MaybeRefOrGetter<string>
	genre: MaybeRefOrGetter<string>
}
