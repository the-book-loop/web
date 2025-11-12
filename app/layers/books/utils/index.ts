import { capitalize } from '~/core/lib/utils'

export const fmtBookState = (state: string) => {
	const [first, second] = state.split('_')

	return `${capitalize(first!)} ${second ? capitalize(second) : ''}`.trim()
}
