type User = {
	userId: string
	email: string
	firstName: string
	lastName: string
	description: string
	timeZone: string
}

type AuthResponse = User & TokenInfo

type TokenInfo = {
	token: string
	expiresAt: string
}

export type { AuthResponse, TokenInfo, User }
