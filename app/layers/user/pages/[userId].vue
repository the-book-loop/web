<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { userOptions } from '../queries/getUser'

const userId = useRouteParams('userId', '', { transform: String })

const { data: user, isLoading } = useQuery(userOptions(userId))

useSeoMeta({
	title: () =>
		isLoading.value
			? 'Loading...'
			: `${user.value?.firstName} ${user.value?.lastName}`,
})
</script>

<template>
	<div class="w-full max-w-5xl mr-auto px-4">
		<template v-if="isLoading || !user">
			<div class="space-y-6">
				<div
					class="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white rounded-xl animate-pulse"
				>
					<div class="size-32 bg-slate-200 rounded-full shrink-0"></div>
					<div class="flex-1 space-y-4 w-full">
						<div class="h-8 w-48 bg-slate-200 rounded"></div>
						<div class="h-5 w-64 bg-slate-200 rounded"></div>
						<div class="h-20 w-full bg-slate-200 rounded"></div>
					</div>
				</div>

				<!-- Statistics Skeleton -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div
						v-for="i in 3"
						:key="i"
						class="p-6 bg-white rounded-xl space-y-3 animate-pulse"
					>
						<div class="h-6 w-32 bg-slate-200 rounded"></div>
						<div class="h-10 w-20 bg-slate-200 rounded"></div>
					</div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<!-- Books Skeleton -->
					<div class="p-6 bg-white rounded-xl space-y-4 animate-pulse">
						<div class="h-8 w-40 bg-slate-200 rounded"></div>
						<div class="space-y-3">
							<div
								v-for="i in 3"
								:key="i"
								class="h-20 bg-slate-200 rounded-lg"
							></div>
						</div>
					</div>

					<!-- Reviews Skeleton -->
					<div class="p-6 bg-white rounded-xl space-y-4 animate-pulse">
						<div class="h-8 w-32 bg-slate-200 rounded"></div>
						<div class="space-y-4">
							<div
								v-for="i in 3"
								:key="i"
								class="p-4 bg-slate-50 rounded-lg space-y-3"
							>
								<div class="h-5 w-40 bg-slate-200 rounded"></div>
								<div class="h-4 w-full bg-slate-200 rounded"></div>
								<div class="h-4 w-3/4 bg-slate-200 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="space-y-6">
				<div
					class="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white rounded-xl"
				>
					<div
						class="size-32 bg-primary/20 rounded-full flex items-center justify-center shrink-0"
					>
						<Icon name="lucide:user-round" class="size-16! text-primary" />
					</div>
					<div class="flex-1 text-center md:text-left">
						<h1
							class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-lateef text-primary"
						>
							{{ user.firstName }} {{ user.lastName }}
						</h1>
						<p class="text-xl font-lateef text-primary/50 mt-2">
							{{ user.email }}
						</p>
						<p
							v-if="user.description"
							class="font-lateef text-lg text-primary/70 mt-4"
						>
							{{ user.description }}
						</p>
						<p v-else class="font-lateef text-lg text-primary/50 italic mt-4">
							No bio
						</p>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="p-6 bg-white rounded-xl">
						<div class="flex items-center gap-3">
							<div class="p-3 bg-amber-100 rounded-lg">
								<Icon name="lucide:star" class="size-6! text-amber-600" />
							</div>
							<div>
								<p class="font-lateef text-sm text-primary/50">
									Average Rating
								</p>
								<p
									class="scroll-m-20 text-3xl font-bold tracking-tight font-lateef text-primary"
								>
									{{ user.averageRating.toFixed(1) }}
								</p>
							</div>
						</div>
					</div>

					<div class="p-6 bg-white rounded-xl">
						<div class="flex items-center gap-3">
							<div class="p-3 bg-blue-100 rounded-lg">
								<Icon
									name="lucide:message-square"
									class="size-6! text-blue-600"
								/>
							</div>
							<div>
								<p class="font-lateef text-sm text-primary/50">Total Reviews</p>
								<p
									class="scroll-m-20 text-3xl font-bold tracking-tight font-lateef text-primary"
								>
									{{ user.totalReviews }}
								</p>
							</div>
						</div>
					</div>

					<div class="p-6 bg-white rounded-xl">
						<div class="flex items-center gap-3">
							<div class="p-3 bg-green-100 rounded-lg">
								<Icon
									name="lucide:check-circle"
									class="size-6! text-green-600"
								/>
							</div>
							<div>
								<p class="font-lateef text-sm text-primary/50">
									Completed Exchanges
								</p>
								<p
									class="scroll-m-20 text-3xl font-bold tracking-tight font-lateef text-primary"
								>
									{{ user.completedExchanges }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div class="p-6 bg-white rounded-xl">
						<h2
							class="scroll-m-20 text-3xl font-bold tracking-tight lg:text-3xl font-lateef text-primary mb-6"
						>
							Books ({{ user.books.length }})
						</h2>
						<div v-if="user.books.length > 0" class="space-y-3">
							<NuxtLink
								v-for="book in user.books"
								:key="book.id"
								:to="`/books/${book.id}`"
								class="p-3 border border-slate-200 rounded-lg hover:border-primary hover:shadow-md transition-all flex gap-3"
							>
								<NuxtImg
									class="rounded-md w-12 h-16 object-cover shrink-0"
									src="/img/book-fallback.webp"
								/>
								<div class="flex-1 min-w-0">
									<h3
										class="font-lateef text-base font-bold text-primary truncate"
									>
										{{ book.title }}
									</h3>
									<p class="font-lateef text-sm text-primary/50 truncate">
										{{ book.author }}
									</p>
									<p class="font-lateef text-xs text-primary/50 mt-1">
										{{ book.genre }}
									</p>
								</div>
							</NuxtLink>
						</div>
						<div v-else class="text-center py-12">
							<Icon
								name="lucide:book-x"
								class="size-16! text-primary/20 mx-auto mb-4"
							/>
							<p class="font-lateef text-xl text-primary/50">
								No books created yet
							</p>
						</div>
					</div>

					<div class="p-6 bg-white rounded-xl">
						<h2
							class="scroll-m-20 text-3xl font-bold tracking-tight lg:text-3xl font-lateef text-primary mb-6"
						>
							Reviews ({{ user.reviews.length }})
						</h2>
						<div v-if="user.reviews.length > 0" class="space-y-4">
							<div
								v-for="review in user.reviews"
								:key="review.id"
								class="p-4 bg-slate-50 rounded-lg"
							>
								<div class="flex items-start justify-between mb-3">
									<div class="flex items-center gap-3">
										<div
											class="size-10 bg-primary/20 rounded-full flex items-center justify-center"
										>
											<Icon
												name="lucide:user-round"
												class="size-5! text-primary"
											/>
										</div>
										<div>
											<p class="font-lateef text-lg font-semibold text-primary">
												{{ review.reviewerFirstName }}
												{{ review.reviewerLastName }}
											</p>
											<div class="flex items-center gap-1">
												<Icon
													v-for="star in 5"
													:key="star"
													name="lucide:star"
													:class="[
														'size-4!',
														star <= review.rating
															? 'text-amber-500 fill-amber-500'
															: 'text-slate-300',
													]"
												/>
											</div>
										</div>
									</div>
								</div>
								<p class="font-lateef text-base text-primary/70">
									{{ review.comment }}
								</p>
							</div>
						</div>
						<div v-else class="text-center py-12">
							<Icon
								name="lucide:message-square-x"
								class="size-16! text-primary/20 mx-auto mb-4"
							/>
							<p class="font-lateef text-xl text-primary/50">
								No reviews received yet
							</p>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
