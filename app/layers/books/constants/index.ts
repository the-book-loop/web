import type { GetAllBooksParams } from '../types'

export const BOOKS_QUERY_KEYS = {
	all: ['books'],
	byUser: (userId: MaybeRefOrGetter<string>) => ['user-books', toValue(userId)],
	byId: (bookId: MaybeRefOrGetter<string>) => [
		...BOOKS_QUERY_KEYS.all,
		toValue(bookId),
	],
	search: ({ query, condition, language, genre }: GetAllBooksParams) => [
		...BOOKS_QUERY_KEYS.all,
		'search',
		toValue(query),
		toValue(condition),
		toValue(language),
		toValue(genre),
	],
	genres: () => [...BOOKS_QUERY_KEYS.all, 'genres'],
	languages: () => [...BOOKS_QUERY_KEYS.all, 'languages'],
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
