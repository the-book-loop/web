# Nuxt Chat Implementation Plan

## Overview

This plan outlines the implementation of a real-time chat feature in a Nuxt 3 application, integrating with the existing C# backend API that uses SignalR for real-time communication.

---

## Backend API Analysis

### API Endpoints

#### 1. GET /api/Chat

**Description**: Get all chats for the authenticated user
**Authorization**: Required (Bearer token)
**Response**: Array of `ChatResponse` objects sorted by last message time

#### 2. GET /api/Chat/{id}

**Description**: Get a specific chat by ID
**Authorization**: Required (Bearer token)
**Parameters**:

- `id` (path, UUID): Chat ID
  **Response**: `ChatResponse` object

#### 3. POST /api/Chat

**Description**: Create or get chat for an exchange
**Authorization**: Required (Bearer token)
**Request Body**:

```json
{
	"exchangeId": "uuid"
}
```

**Response**: `ChatResponse` object (201 Created)

#### 4. GET /api/Chat/{id}/messages

**Description**: Get messages for a chat with pagination
**Authorization**: Required (Bearer token)
**Parameters**:

- `id` (path, UUID): Chat ID
- `limit` (query, int, default: 100): Number of messages to retrieve
- `offset` (query, int, default: 0): Offset for pagination
  **Response**: Array of `MessageResponse` objects (ordered by SentAt ascending)

#### 5. POST /api/Chat/{id}/message

**Description**: Send a message to a chat
**Authorization**: Required (Bearer token)
**Parameters**:

- `id` (path, UUID): Chat ID
  **Request Body**:

```json
{
	"chatId": "uuid",
	"text": "message text (max 1000 chars)"
}
```

**Response**: `MessageResponse` object (201 Created)

### SignalR Hub: ChatHub

**Hub URL**: `/hubs/chat` (or configured SignalR endpoint)

#### Methods to Invoke (Client → Server)

1. **JoinChat(chatId: string)**: Join a specific chat room
2. **LeaveChat(chatId: string)**: Leave a specific chat room
3. **SendMessage(chatId: string, text: string)**: Send a message via SignalR

#### Events to Listen (Server → Client)

1. **ReceiveMessage**: Triggered when a new message is sent
   - Payload: `ChatNotification` object
   ```json
   {
   	"chatId": "uuid",
   	"message": {
   		"id": "uuid",
   		"chatId": "uuid",
   		"senderId": "uuid",
   		"senderFirstName": "string",
   		"senderLastName": "string",
   		"text": "string",
   		"sentAt": "datetime",
   		"created": "datetime"
   	}
   }
   ```

### Data Models

#### ChatResponse

```typescript
{
	id: string
	userId1: string
	user1FirstName: string
	user1LastName: string
	userId2: string
	user2FirstName: string
	user2LastName: string
	exchangeId: string | null
	lastMessage: MessageResponse | null
	created: string // ISO datetime
	modified: string // ISO datetime
}
```

#### MessageResponse

```typescript
{
	id: string
	chatId: string
	senderId: string
	senderFirstName: string
	senderLastName: string
	text: string
	sentAt: string // ISO datetime
	created: string // ISO datetime
}
```

---

## Implementation Plan

### Phase 1: Setup & Infrastructure

#### 1.1 Install Dependencies

```bash
npm install @microsoft/signalr
npm install @vueuse/core  # For composables like useStorage, useIntersectionObserver
```

#### 1.2 Configure Environment Variables

Add to `.env`:

```env
NUXT_PUBLIC_API_BASE_URL=https://your-api-url.com
NUXT_PUBLIC_SIGNALR_HUB_URL=https://your-api-url.com/hubs/chat
```

#### 1.3 Create TypeScript Type Definitions

**File**: `types/chat.ts`

```typescript
export interface ChatResponse {
	id: string
	userId1: string
	user1FirstName: string
	user1LastName: string
	userId2: string
	user2FirstName: string
	user2LastName: string
	exchangeId: string | null
	lastMessage: MessageResponse | null
	created: string
	modified: string
}

export interface MessageResponse {
	id: string
	chatId: string
	senderId: string
	senderFirstName: string
	senderLastName: string
	text: string
	sentAt: string
	created: string
}

export interface CreateChatRequest {
	exchangeId: string
}

export interface SendMessageRequest {
	chatId: string
	text: string
}

export interface ChatNotification {
	chatId: string
	message: MessageResponse
}
```

### Phase 2: API Integration Layer (Using @tanstack/vue-query)

**Overview**: This project uses @tanstack/vue-query for data fetching and state management. Instead of creating a traditional API composable, we'll follow the project's existing pattern:

- **Query Options** (`queries/` directory): Define query configurations using `queryOptions()` from @tanstack/vue-query
- **Mutations** (`mutations/` directory): Define mutation configurations using `useMutation()` from @tanstack/vue-query
- **Query Keys** (`constants/` directory): Centralized query key management for cache invalidation
- **Benefits**: Built-in caching, automatic refetching, optimistic updates, loading states, error handling

This approach aligns with how the project already handles books, exchanges, and authentication.

#### 2.1 Create Query Keys Constants

**File**: `app/layers/chats/constants/index.ts`

```typescript
export const CHATS_QUERY_KEYS = {
	all: ['chats'] as const,
	byUser: () => [...CHATS_QUERY_KEYS.all, 'user'],
	byId: (chatId: MaybeRefOrGetter<string>) => [
		...CHATS_QUERY_KEYS.all,
		toValue(chatId),
	],
	messages: (chatId: MaybeRefOrGetter<string>) => [
		...CHATS_QUERY_KEYS.byId(chatId),
		'messages',
	],
	messagesPaginated: (
		chatId: MaybeRefOrGetter<string>,
		limit: MaybeRefOrGetter<number>,
		offset: MaybeRefOrGetter<number>,
	) => [...CHATS_QUERY_KEYS.messages(chatId), toValue(limit), toValue(offset)],
}
```

#### 2.2 Create Query Options

**File**: `app/layers/chats/queries/getUserChats.ts`

```typescript
import { queryOptions } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { ChatResponse } from '../types'

export const userChatsOptions = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: CHATS_QUERY_KEYS.byUser(),
		queryFn: async () => {
			const chats = await $fetch<ChatResponse[]>('/api/Chat', {
				baseURL: apiBaseUrl,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return chats
		},
	})
}
```

**File**: `app/layers/chats/queries/getChatById.ts`

```typescript
import { queryOptions } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { ChatResponse } from '../types'

export const chatByIdOptions = (chatId: MaybeRefOrGetter<string>) => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: CHATS_QUERY_KEYS.byId(chatId),
		queryFn: async () => {
			const chat = await $fetch<ChatResponse>(`/api/Chat/${toValue(chatId)}`, {
				baseURL: apiBaseUrl,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return chat
		},
	})
}
```

**File**: `app/layers/chats/queries/getChatMessages.ts`

```typescript
import { queryOptions } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { MessageResponse } from '../types'

export const chatMessagesOptions = (
	chatId: MaybeRefOrGetter<string>,
	limit: MaybeRefOrGetter<number> = 100,
	offset: MaybeRefOrGetter<number> = 0,
) => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	return queryOptions({
		queryKey: CHATS_QUERY_KEYS.messagesPaginated(chatId, limit, offset),
		queryFn: async () => {
			const messages = await $fetch<MessageResponse[]>(
				`/api/chat/${toValue(chatId)}/messages`,
				{
					baseURL: apiBaseUrl,
					method: 'GET',
					query: {
						limit: toValue(limit),
						offset: toValue(offset),
					},
					headers: {
						Authorization: `Bearer ${tokenInfo.value?.token}`,
					},
				},
			)

			return messages
		},
	})
}
```

#### 2.3 Create Mutations

**File**: `app/layers/chats/mutations/useCreateChat.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { ChatResponse, CreateChatRequest } from '../types'

export const useCreateChat = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: CreateChatRequest) => {
			const response = await $fetch<ChatResponse>('/api/Chat', {
				baseURL: apiBaseUrl,
				method: 'POST',
				body: data,
				headers: {
					Authorization: `Bearer ${tokenInfo.value?.token}`,
				},
			})

			return response
		},
		onSuccess: async () => {
			// Invalidate user chats to refetch with new chat
			await queryClient.invalidateQueries({
				queryKey: CHATS_QUERY_KEYS.byUser(),
			})
		},
	})
}
```

**File**: `app/layers/chats/mutations/useSendMessage.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { MessageResponse, SendMessageRequest } from '../types'

export const useSendMessage = () => {
	const {
		public: { apiBaseUrl },
	} = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ chatId, text }: { chatId: string; text: string }) => {
			const response = await $fetch<MessageResponse>(
				`/api/Chat/${chatId}/message`,
				{
					baseURL: apiBaseUrl,
					method: 'POST',
					body: { chatId, text } as SendMessageRequest,
					headers: {
						Authorization: `Bearer ${tokenInfo.value?.token}`,
					},
				},
			)

			return response
		},
		onMutate: async ({ chatId, text }) => {
			// Optimistic update: add message immediately to UI
			const tempMessage: MessageResponse = {
				id: `temp-${Date.now()}`,
				chatId,
				senderId: tokenInfo.value?.userId || '',
				senderFirstName: '',
				senderLastName: '',
				text,
				sentAt: new Date().toISOString(),
				created: new Date().toISOString(),
			}

			// Cancel outgoing queries to avoid overwriting optimistic update
			await queryClient.cancelQueries({
				queryKey: CHATS_QUERY_KEYS.messages(chatId),
			})

			// Snapshot previous value
			const previousMessages = queryClient.getQueryData(
				CHATS_QUERY_KEYS.messages(chatId),
			)

			// Optimistically update messages
			queryClient.setQueryData(
				CHATS_QUERY_KEYS.messages(chatId),
				(old: MessageResponse[] = []) => [...old, tempMessage],
			)

			return { previousMessages, chatId }
		},
		onError: (err, variables, context) => {
			// Rollback on error
			if (context?.previousMessages) {
				queryClient.setQueryData(
					CHATS_QUERY_KEYS.messages(context.chatId),
					context.previousMessages,
				)
			}
		},
		onSuccess: async (data, { chatId }) => {
			// Invalidate messages query to get actual server data
			await queryClient.invalidateQueries({
				queryKey: CHATS_QUERY_KEYS.messages(chatId),
			})

			// Also invalidate user chats to update last message
			await queryClient.invalidateQueries({
				queryKey: CHATS_QUERY_KEYS.byUser(),
			})
		},
	})
}
```

**Key Implementation Details**:

- Use `queryOptions` for queries following project pattern
- Use `useMutation` for create/send operations
- Include authentication token from auth store
- Implement optimistic updates for better UX
- Handle error responses (400, 401, 403, 404)
- Invalidate relevant queries on mutations
- Use query keys constants for cache management

#### 2.4 Create SignalR Connection Composable

**File**: `app/layers/chats/composables/useSignalR.ts`

Implement:

- `connection`: HubConnection instance
- `connectionState`: Reactive connection status
- `connect()`: Establish SignalR connection with auth token
- `disconnect()`: Close connection
- `joinChat(chatId: string)`: Join chat group
- `leaveChat(chatId: string)`: Leave chat group
- `sendMessage(chatId: string, text: string)`: Send message via SignalR
- `onReceiveMessage(callback: (notification: ChatNotification) => void)`: Register message listener
- Auto-reconnection logic on connection drops

**Key Implementation Details**:

- Use `@microsoft/signalr` HubConnectionBuilder
- Configure with `withUrl()` including access token
- Set automatic reconnect with `.withAutomaticReconnect()`
- Handle connection state changes (Connected, Disconnected, Reconnecting)
- Clean up listeners on unmount

### Phase 3: State Management

#### 3.1 Real-time Integration with TanStack Query

Since we're using @tanstack/vue-query, most of the state management is handled by the query cache. We only need to manage:

1. **Active chat selection** (simple reactive ref)
2. **Real-time message updates** (via SignalR → query invalidation)
3. **Unread counts** (local state or separate query)

**File**: `app/layers/chats/composables/useChatState.ts`

```typescript
import { useQueryClient } from '@tanstack/vue-query'
import { CHATS_QUERY_KEYS } from '../constants'
import type { ChatNotification } from '../types'

export const useChatState = () => {
	const queryClient = useQueryClient()
	const activeChatId = useState<string | null>('active-chat-id', () => null)
	const unreadCounts = useState<Record<string, number>>(
		'unread-counts',
		() => ({}),
	)

	const selectChat = (chatId: string) => {
		activeChatId.value = chatId
		// Clear unread count for this chat
		if (unreadCounts.value[chatId]) {
			unreadCounts.value[chatId] = 0
		}
	}

	const handleIncomingMessage = (notification: ChatNotification) => {
		const { chatId, message } = notification

		// Update messages cache by invalidating the query
		queryClient.invalidateQueries({
			queryKey: CHATS_QUERY_KEYS.messages(chatId),
		})

		// Update chats list to reflect new last message
		queryClient.invalidateQueries({
			queryKey: CHATS_QUERY_KEYS.byUser(),
		})

		// Increment unread count if not active chat
		if (activeChatId.value !== chatId) {
			unreadCounts.value[chatId] = (unreadCounts.value[chatId] || 0) + 1
		}
	}

	return {
		activeChatId: readonly(activeChatId),
		unreadCounts: readonly(unreadCounts),
		selectChat,
		handleIncomingMessage,
	}
}
```

**Integration**:

- Use query options from `app/layers/chats/queries/` for data fetching
- Use mutations from `app/layers/chats/mutations/` for create/send operations
- Use `useSignalR()` for real-time updates
- Subscribe to SignalR `ReceiveMessage` events and call `handleIncomingMessage`
- TanStack Query handles caching, background refetching, and optimistic updates
- Minimal local state reduces complexity and bugs

### Phase 4: UI Components

#### 4.1 ChatList Component

**File**: `components/chat/ChatList.vue`

**Features**:

- Display all user chats sorted by last message time
- Show last message preview and timestamp
- Show unread message count badge
- Highlight active/selected chat
- Handle empty state (no chats)
- Search/filter chats by user name

**Props**:

- `activeChat`: string | null
- `chats`: ChatResponse[]

**Events**:

- `@chat-selected`: Emit when user clicks a chat

**UI Elements**:

- User avatar/initial
- User name (other participant)
- Last message text (truncated)
- Timestamp (formatted: "2m ago", "Yesterday", etc.)
- Unread badge

#### 4.2 ChatMessages Component

**File**: `app/layers/chats/components/ChatMessages.vue`

**Features**:

- Display messages in chronological order
- Auto-scroll to bottom on new messages
- Infinite scroll for loading older messages
- Message grouping by sender
- Message timestamps
- Sender information
- Handle loading states
- Handle empty state (no messages)

**Props**:

- `messages`: MessageResponse[]
- `currentUserId`: string
- `isLoading`: boolean

**Events**:

- `@load-more`: Emit when scrolling to top (pagination)

**UI Elements**:

- Message bubbles (left for other user, right for current user)
- Sender name and avatar
- Message text
- Timestamp
- Loading spinner for older messages

#### 4.3 ChatInput Component

**File**: `app/layers/chats/components/ChatInput.vue`

**Features**:

- Text input for composing messages
- Send button
- Character counter (max 1000)
- Handle Enter key to send (Shift+Enter for new line)
- Disable when not connected or chat not selected
- Show typing indicator (optional enhancement)

**Props**:

- `disabled`: boolean
- `maxLength`: number (default 1000)

**Events**:

- `@send`: Emit message text when user sends

**UI Elements**:

- Textarea with auto-resize
- Send button (icon or text)
- Character count indicator

#### 4.4 ChatWindow Component (Container)

**File**: `app/layers/chats/components/ChatWindow.vue`

**Features**:

- Container that combines ChatMessages and ChatInput
- Manages active chat state
- Handles message sending
- Shows chat header with other user info
- Connection status indicator

**Props**:

- `chat`: ChatResponse | null

**UI Elements**:

- Header: User name, status indicator
- Body: ChatMessages component
- Footer: ChatInput component

### Phase 5: Pages & Routing

#### 5.1 Chat List Page

**File**: `pages/chat/index.vue`

**Layout**: Two-column layout (desktop) or single view (mobile)

- Left: ChatList component
- Right: ChatWindow component (or empty state)

**Functionality**:

- Load all chats on mount
- Initialize SignalR connection
- Handle chat selection
- Navigate to /chat/[id] on selection (mobile)
- Clean up SignalR on unmount

#### 5.2 Chat Detail Page (Mobile)

**File**: `app/layers/chats/pages/chat/[id].vue`

**Features**:

- Full-screen chat view for selected chat
- Back button to return to chat list
- Load chat and messages on mount
- Join SignalR chat room
- Leave room on unmount

### Phase 6: Enhanced Features

#### 6.1 Real-time Updates

- Listen to `ReceiveMessage` events from SignalR
- Update chat list when new message arrives
- Update message list if chat is active
- Show notifications for background chats
- Update unread counts

#### 6.2 Optimistic UI Updates

- Show message immediately when sent (before server confirms)
- Add "sending" indicator
- Handle send failures gracefully
- Retry mechanism for failed messages

#### 6.3 Connection Management

- Show connection status in UI
- Automatic reconnection on disconnect
- Queue messages when offline
- Sync state after reconnection

#### 6.4 Pagination & Performance

- Implement virtual scrolling for large message lists
- Lazy load older messages on scroll
- Cache loaded messages locally
- Debounce scroll events

#### 6.5 Notifications

- Browser notifications for new messages (when tab inactive)
- Sound notifications (optional)
- Desktop notifications API integration
- Request permission on first use

#### 6.6 Polish & UX

- Loading skeletons
- Error states with retry buttons
- Empty states with helpful messages
- Smooth animations and transitions
- Responsive design (mobile-first)
- Dark mode support
- Accessibility (ARIA labels, keyboard navigation)

#### 6.6 Performance Optimization

- Implement message virtualization
- Optimize re-renders with proper key usage
- Lazy load components
- Code splitting for chat feature
- Optimize bundle size

---

## Implementation Order

### Sprint 1: Core Infrastructure

1. Install dependencies (@microsoft/signalr already installed, verify @tanstack/vue-query)
2. Setup TypeScript types (`app/layers/chats/types/index.ts`)
3. Create query keys constants (`app/layers/chats/constants/index.ts`)
4. Create query options (getUserChats, getChatById, getChatMessages)
5. Create mutations (useCreateChat, useSendMessage)
6. Create useSignalR composable
7. Create useChatState composable
8. Test queries and mutations in a test page

### Sprint 2: Basic UI

1. Create ChatList component
2. Create ChatMessages component
3. Create ChatInput component
4. Create ChatWindow component
5. Build chat list page with basic layout
6. Wire up components with queries and mutations

### Sprint 3: Real-time & Integration

1. Integrate SignalR with useChatState
2. Implement real-time message updates via query invalidation
3. Test optimistic updates (already in useSendMessage mutation)
4. Handle connection states
5. Test message flow end-to-end

### Sprint 4: Enhanced Features

1. Add pagination for messages
2. Implement unread counts
3. Add browser notifications
4. Improve error handling
5. Add loading states and skeletons

### Sprint 5: Polish & Testing

1. Improve responsive design
2. Add animations and transitions
3. Write unit and integration tests
4. Performance optimization
5. Accessibility improvements
6. Final QA and bug fixes

---

## Key Considerations

### Authentication

- Ensure auth token is available before connecting to SignalR
- Refresh token mechanism for long-lived connections
- Handle 401 errors and redirect to login

### Error Handling

- Network errors
- Connection failures
- Message send failures
- Invalid chat access (403)
- Chat not found (404)

### Security

- Validate user permissions on backend (already implemented)
- Sanitize message input to prevent XSS
- Rate limiting on message sending (frontend throttle)

### Performance

- Limit initial message load (default 100)
- Use pagination for older messages
- Debounce scroll events
- Cache messages locally
- Clean up old messages from memory

### Mobile Considerations

- Touch-friendly UI
- Swipe gestures
- Proper keyboard handling
- Push notifications (if mobile app)
- Reduced data usage

---

## API Error Codes Reference

| Status Code | Description  | User Action           |
| ----------- | ------------ | --------------------- |
| 200         | Success      | Continue              |
| 201         | Created      | Chat/Message created  |
| 400         | Bad Request  | Show error message    |
| 401         | Unauthorized | Redirect to login     |
| 403         | Forbidden    | Show "Access denied"  |
| 404         | Not Found    | Show "Chat not found" |

---

## Example Code Snippets

### Usage in Components

**Example: Using queries in a page**

```vue
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { userChatsOptions } from '~/layers/chats/queries/getUserChats'
import { chatMessagesOptions } from '~/layers/chats/queries/getChatMessages'

// Fetch all user chats
const { data: chats, isLoading, error } = useQuery(userChatsOptions())

// Fetch messages for a specific chat
const activeChatId = ref<string | null>(null)
const { data: messages } = useQuery({
	...chatMessagesOptions(activeChatId, 50, 0),
	enabled: computed(() => activeChatId.value !== null),
})
</script>
```

**Example: Using mutations in a component**

```vue
<script setup lang="ts">
import { useSendMessage } from '~/layers/chats/mutations/useSendMessage'
import { useCreateChat } from '~/layers/chats/mutations/useCreateChat'

const sendMessageMutation = useSendMessage()
const createChatMutation = useCreateChat()

const handleSendMessage = async (text: string) => {
	if (!activeChatId.value) return

	await sendMessageMutation.mutateAsync({
		chatId: activeChatId.value,
		text,
	})
}

const handleCreateChat = async (exchangeId: string) => {
	const newChat = await createChatMutation.mutateAsync({ exchangeId })
	activeChatId.value = newChat.id
}
</script>
```

### useSignalR.ts (Partial)

```typescript
import * as signalR from '@microsoft/signalr'

export const useSignalR = () => {
	const config = useRuntimeConfig()
	const { getToken } = useAuth()

	const connection = ref<signalR.HubConnection | null>(null)
	const connectionState = ref<signalR.HubConnectionState>(
		signalR.HubConnectionState.Disconnected,
	)

	const connect = async () => {
		const token = await getToken()

		connection.value = new signalR.HubConnectionBuilder()
			.withUrl(`${config.public.signalrHubUrl}`, {
				accessTokenFactory: () => token,
			})
			.withAutomaticReconnect()
			.build()

		connection.value.on('ReceiveMessage', (notification: ChatNotification) => {
			// Handle incoming message
		})

		await connection.value.start()
		connectionState.value = connection.value.state
	}

	const sendMessage = async (chatId: string, text: string) => {
		if (connection.value?.state === signalR.HubConnectionState.Connected) {
			await connection.value.invoke('SendMessage', chatId, text)
		}
	}

	return {
		connection,
		connectionState,
		connect,
		sendMessage,
		// ... other methods
	}
}
```

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building a production-ready chat feature in Nuxt 4 that integrates with your C# SignalR backend. Follow the phases sequentially, and adjust based on your specific requirements and timeline.

Key success factors:

1. Proper SignalR connection management
2. Robust error handling
3. Optimistic UI updates for better UX
4. Efficient state management
5. Performance optimization for large message lists
6. Thorough testing at each phase

Good luck with the implementation!
