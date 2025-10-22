<script lang="ts" setup></script>

<template>
	<div class="w-2xl bg-white p-4 rounded-xl h-fit">
		<div class="inline-flex w-full justify-between items-center">
			<h1 class="text-3xl font-bold text-primary font-lateef">My Books</h1>
			<Button variant="outline" as-child>
				<NuxtLink to="/profile/books/new">
					<Icon name="lucide:plus" />
					Add book
				</NuxtLink>
			</Button>
		</div>
	</div>
</template>
