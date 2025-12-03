import { capitalize } from '~/core/lib/utils'

export const fmtBookState = (state: string) => {
	const [first, second] = state.split('_')

	return `${capitalize(first!)} ${second ? capitalize(second) : ''}`.trim()
}

export const addFilter = <T extends string>(
	obj: Record<string, string>,
	key: string,
	value: MaybeRefOrGetter<T>,
) => {
	const unwrappedValue = toValue(value)

	if (unwrappedValue && unwrappedValue !== 'all') {
		obj[key] = unwrappedValue
	}
}

export const addFilters = <T extends string>(
	filters: Record<string, string>,
	filterMap: Record<string, MaybeRefOrGetter<T>>,
) => {
	Object.entries(filterMap).forEach(([key, value]) =>
		addFilter(filters, key, value),
	)
}
