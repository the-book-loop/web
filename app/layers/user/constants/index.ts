export const TECHNICAL_SUPPORT_QUERY_KEYS = {
	all: ['technical-support'] as const,
	byId: (ticketId: MaybeRefOrGetter<string>) =>
		[...TECHNICAL_SUPPORT_QUERY_KEYS.all, toValue(ticketId)] as const,
}
