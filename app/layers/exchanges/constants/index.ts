export const EXCHANGES_QUEERY_KEYS = {
	all: ['exchanges'] as const,
	sentByUser: (userId: MaybeRefOrGetter<string>) => [
		...EXCHANGES_QUEERY_KEYS.all,
		toValue(userId),
		'sent',
	],
	recievedByUser: (userId: MaybeRefOrGetter<string>) => [
		...EXCHANGES_QUEERY_KEYS.all,
		toValue(userId),
		'received',
	],
}

export const EXCHANGE_STATUS = {
	PENDING: 0,
	ACCEPTED: 1,
	DECLINED: 2,
}
