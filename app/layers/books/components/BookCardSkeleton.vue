<template>
	<div
		class="inline-flex w-full justify-between items-center h-26 p-2 rounded-lg"
		aria-busy="true"
	>
		<div class="inline-flex gap-3 items-center w-full">
			<Skeleton class="h-[88px] w-[66px] rounded-md" />
			<div class="flex flex-col gap-2 w-full">
				<Skeleton class="h-6 w-2/3 rounded" />
				<Skeleton class="h-5 w-1/2 rounded" />
				<Skeleton class="h-5 w-full rounded" />
			</div>
		</div>
		<Skeleton class="size-7! rounded-full shrink-0" />
	</div>
</template>
