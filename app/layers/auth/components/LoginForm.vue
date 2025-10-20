<script lang="ts" setup></script>

<template>
	<form class="w-md space-y-4">
		<FormField name="email">
			<FormItem>
				<FormLabel>Email</FormLabel>
				<FormControl>
					<div class="relative">
						<Input
							class="pl-9"
							type="email"
							placeholder="Enter email"
							autofocus
						/>
						<span
							class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
						>
							<Icon name="lucide:mail" />
						</span>
					</div>
				</FormControl>
			</FormItem>
		</FormField>
		<FormField name="password">
			<FormItem>
				<FormLabel>Password</FormLabel>
				<FormControl>
					<div class="relative">
						<Input
							class="pl-9"
							type="password"
							placeholder="Enter password"
							autofocus
						/>
						<span
							class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
						>
							<Icon name="lucide:key-round" />
						</span>
					</div>
				</FormControl>
			</FormItem>
		</FormField>
		<Button>Login</Button>
	</form>
</template>
