const TECHNICAL_SUPPORT_QUERY_KEYS = {
	all: ['technical-support'] as const,
	byId: (ticketId: MaybeRefOrGetter<string>) =>
		[...TECHNICAL_SUPPORT_QUERY_KEYS.all, toValue(ticketId)] as const,
}

const USERS_QUERY_KEYS = {
	all: ['users'] as const,
	byId: (userId: MaybeRefOrGetter<string>) =>
		[...USERS_QUERY_KEYS.all, toValue(userId)] as const,
}

export { TECHNICAL_SUPPORT_QUERY_KEYS, USERS_QUERY_KEYS }
