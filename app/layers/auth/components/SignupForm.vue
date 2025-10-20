<script lang="ts" setup></script>

<template>
	<form class="w-md space-y-4">
		<div class="grid grid-cols-2 gap-4">
			<FormField name="firstName">
				<FormItem>
					<FormLabel>First Name</FormLabel>
					<FormControl>
						<div class="relative">
							<Input
								class="pl-9"
								type="text"
								placeholder="Enter first name"
								autofocus
							/>
							<span
								class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
							>
								<Icon name="lucide:user-round" />
							</span>
						</div>
					</FormControl>
				</FormItem>
			</FormField>
			<FormField name="lastName">
				<FormItem>
					<FormLabel>Last Name</FormLabel>
					<FormControl>
						<div class="relative">
							<Input class="pl-9" type="text" placeholder="Enter last name" />
							<span
								class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
							>
								<Icon name="lucide:user-round" />
							</span>
						</div>
					</FormControl>
				</FormItem>
			</FormField>
		</div>
		<FormField name="email">
			<FormItem>
				<FormLabel>Email</FormLabel>
				<FormControl>
					<div class="relative">
						<Input class="pl-9" type="email" placeholder="Enter email" />
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
		<Button>Signup</Button>
	</form>
</template>
