import { z } from 'zod'
import { BOOK_STATES } from '../constants'

export const CreateBookSchema = z.object({
	title: z
		.string({ required_error: 'Title is required' })
		.min(5, 'Title should be at least 5 characters long'),
	description: z
		.string({ required_error: 'Description is required' })
		.min(10, 'Description should be at least 10 characters long'),
	author: z
		.string({ required_error: 'Author is required' })
		.min(3, 'Author should be at least 3 characters long'),
	language: z.string({ required_error: 'Language is required' }),
	state: z.enum(BOOK_STATES, { required_error: 'State is required' }),
	genre: z
		.string({ required_error: 'Genre is required' })
		.min(3, 'Genre should be at least 3 characters long'),
})

export type CreateBook = z.infer<typeof CreateBookSchema>
