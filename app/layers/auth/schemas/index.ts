import { z } from 'zod'

const LoginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email('Please enter a valid email address'),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, 'Your password must be at least 6 characters long'),
})

type LoginData = z.infer<typeof LoginSchema>

const SignupSchema = LoginSchema.extend({
	firstName: z
		.string({ required_error: 'First name is required' })
		.min(1, 'Please enter your first name'),

	lastName: z
		.string({ required_error: 'Last name is required' })
		.min(1, 'Please enter your last name'),

	timeZone: z
		.string({ required_error: 'Time zone is required' })
		.min(1, 'Please select your time zone'),

	location: z
		.string({ required_error: 'Location is required' })
		.min(1, 'Please enter your location'),
})

type SignupData = z.infer<typeof SignupSchema>

export { LoginSchema, SignupSchema }
export type { LoginData, SignupData }
