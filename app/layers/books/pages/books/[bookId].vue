<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { useRouteParams } from '@vueuse/router'
import { bookOptions } from '../../queries/getBook'

const bookId = useRouteParams('bookId', '', { transform: String })

const { data: book, isLoading } = useQuery(bookOptions(bookId))

useSeoMeta({
	title: () => (isLoading.value ? 'Loading...' : book.value?.title),
})
</script>

<template>
	<div class="grid grid-cols-[80%_20%] gap-4 w-5xl">
		<template v-if="isLoading || !book">
			<div>
				<div class="inline-flex items-center gap-5 animate-pulse">
					<div class="rounded-lg w-[120px] h-[180px] bg-slate-200"></div>
					<div class="flex flex-col space-y-2">
						<div class="h-10 w-72 bg-slate-200 rounded" />
						<div class="h-6 w-48 bg-slate-200 rounded" />
					</div>
				</div>

				<div
					class="flex flex-col w-full p-4 bg-white rounded-xl mt-4 animate-pulse"
				>
					<div class="h-8 w-40 bg-slate-200 rounded mb-3"></div>
					<div class="space-y-3">
						<div class="h-5 w-56 bg-slate-200 rounded" />
						<div class="h-5 w-44 bg-slate-200 rounded" />
						<div class="h-5 w-48 bg-slate-200 rounded" />
						<div class="h-5 w-36 bg-slate-200 rounded" />
					</div>
					<div class="h-4 w-full bg-slate-200 rounded mt-4" />
					<div class="h-24 w-full bg-slate-200 rounded mt-2" />
					<div class="h-5 w-28 bg-slate-200 rounded mt-4" />
				</div>
			</div>

			<div class="flex flex-col size-full items-center justify-center gap-4">
				<div
					class="flex size-16 bg-primary/20 rounded-full items-center justify-center animate-pulse"
				>
					<div class="h-10 w-10 rounded-full bg-slate-200"></div>
				</div>
				<div class="h-6 w-36 bg-slate-200 rounded animate-pulse"></div>
				<div class="h-10 w-40 bg-slate-200 rounded animate-pulse"></div>
			</div>
		</template>
		<template v-else>
			<div>
				<div class="inline-flex items-center gap-5">
					<NuxtImg class="rounded-lg w-[120px]" src="/img/book-fallback.webp" />
					<div class="flex flex-col">
						<h1
							class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-lateef text-primary"
						>
							{{ book.title }}
						</h1>
						<p class="text-2xl font-lateef text-primary/50">
							{{ book.author }}
						</p>
					</div>
				</div>
				<div class="flex flex-col w-full p-4 bg-white rounded-xl">
					<h2
						class="scroll-m-20 text-3xl font-bold tracking-tight lg:text-3xl font-lateef text-primary"
					>
						Characteristics
					</h2>
					<div class="inline-flex gap-1">
						<p class="font-lateef text-xl text-primary/50">Condition:</p>
						<p class="font-lateef text-xl text-primary">
							{{ fmtBookState(book.state) }}
						</p>
					</div>
					<div class="inline-flex gap-1">
						<p class="font-lateef text-xl text-primary/50">Genre:</p>
						<p class="font-lateef text-xl text-primary">{{ book.genre }}</p>
					</div>
					<div class="inline-flex gap-1">
						<p class="font-lateef text-xl text-primary/50">Author:</p>
						<p class="font-lateef text-xl text-primary">{{ book.author }}</p>
					</div>
					<div class="inline-flex gap-1">
						<p class="font-lateef text-xl text-primary/50">Language:</p>
						<p class="font-lateef text-xl text-primary">{{ book.language }}</p>
					</div>
					<h2
						class="scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl font-lateef text-primary"
					>
						Description
					</h2>
					<p class="font-lateef text-xl text-primary/50">
						{{ book.description }}
					</p>
					<p class="font-lateef text-lg text-primary/50 mt-5">
						ID: {{ book.id }}
					</p>
				</div>
			</div>
			<div class="flex flex-col size-full items-center justify-center gap-4">
				<div
					class="flex size-16 bg-primary/20 rounded-full items-center justify-center"
				>
					<Icon name="lucide:user-round" class="size-8! text-primary" />
				</div>
				{{ book.ownerFirstName }}
				<Button>Send Request</Button>
			</div>
		</template>
	</div>
</template>
