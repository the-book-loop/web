export const CHATS_QUERY_KEYS = {
	all: ['chats'] as const,
	byUser: () => [...CHATS_QUERY_KEYS.all, 'user'] as const,
	byId: (chatId: MaybeRefOrGetter<string>) =>
		[...CHATS_QUERY_KEYS.all, toValue(chatId)] as const,
	messages: (chatId: MaybeRefOrGetter<string>) =>
		[...CHATS_QUERY_KEYS.byId(chatId), 'messages'] as const,
	messagesPaginated: (
		chatId: MaybeRefOrGetter<string>,
		limit: MaybeRefOrGetter<number>,
		offset: MaybeRefOrGetter<number>,
	) =>
		[
			...CHATS_QUERY_KEYS.messages(chatId),
			toValue(limit),
			toValue(offset),
		] as const,
}
