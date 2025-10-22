import { z } from 'zod'

export const EditProfileSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	description: z.string().optional(),
})

export type Profile = z.infer<typeof EditProfileSchema>
