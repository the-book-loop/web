<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { BOOK_STATES } from '../constants'
import { booksGenresOptions } from '../queries/getGenres'
import { booksLanguagesOptions } from '../queries/getLanguages'

useSeoMeta({
	title: 'Search',
})

const input = useRouteQuery('query', '', { transform: String })
const condition = useRouteQuery('condition', 'all', { transform: String })
const language = useRouteQuery('language', 'all', { transform: String })
const genre = useRouteQuery('genre', 'all', { transform: String })

const query = refDebounced(input, 300)

const { data: genres } = useQuery(booksGenresOptions())
const { data: languages } = useQuery(booksLanguagesOptions())

const bookStates = computed(() => {
	return BOOK_STATES.map((state) => {
		return {
			value: state,
			label: fmtBookState(state),
		}
	})
})
</script>

<template>
	<div class="flex flex-col w-2xl gap-4">
		<Input v-model="input" class="w-full" placeholder="Search..." />
		<div class="grid grid-cols-3 w-full gap-2">
			<div class="space-y-1">
				<Label>Condition</Label>
				<Select v-model="condition">
					<SelectTrigger class="w-full">
						<SelectValue placeholder="Select a condition" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all"> All </SelectItem>
						<SelectItem
							v-for="({ label, value }, i) in bookStates"
							:key="i"
							:value
						>
							{{ label }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div class="space-y-1">
				<Label>Language</Label>
				<Select v-model="language">
					<SelectTrigger class="w-full">
						<SelectValue placeholder="Select a language" />
					</SelectTrigger>
					<SelectContent>
						<template v-if="languages">
							<SelectItem value="all"> All </SelectItem>
							<SelectItem
								v-for="({ name }, i) in languages"
								:key="i"
								:value="name"
							>
								{{ name }}
							</SelectItem>
						</template>
					</SelectContent>
				</Select>
			</div>
			<div class="space-y-1">
				<Label>Genre</Label>
				<Select v-model="genre">
					<SelectTrigger class="w-full">
						<SelectValue placeholder="Select a genre" />
					</SelectTrigger>
					<SelectContent>
						<template v-if="genres">
							<SelectItem value="all"> All </SelectItem>
							<SelectItem
								v-for="({ name }, i) in genres"
								:key="i"
								:value="name"
							>
								{{ name }}
							</SelectItem>
						</template>
					</SelectContent>
				</Select>
			</div>
		</div>
		<div class="w-full bg-white p-4 rounded-xl">
			<BooksList :query :condition :language :genre />
		</div>
	</div>
</template>
