export const BOOKS_QUERY_KEYS = {
	byUser: (userId: MaybeRefOrGetter<string>) => ['user-books', toValue(userId)],
}

export const BOOK_STATES = [
	'brand_new',
	'like_new',
	'very_good',
	'good',
	'fair',
	'poor',
	'damaged',
] as const

export type BookState = (typeof BOOK_STATES)[number]
