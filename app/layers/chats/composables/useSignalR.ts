import * as signalR from '@microsoft/signalr'
import type { ChatNotification } from '../types'

export const useSignalR = () => {
	const config = useRuntimeConfig()
	const { tokenInfo } = storeToRefs(useAuthStore())

	const connection = ref<signalR.HubConnection | null>(null)
	const connectionState = ref<signalR.HubConnectionState>(
		signalR.HubConnectionState.Disconnected,
	)
	const isConnected = computed(
		() => connectionState.value === signalR.HubConnectionState.Connected,
	)
	const isConnecting = computed(
		() => connectionState.value === signalR.HubConnectionState.Connecting,
	)
	const isReconnecting = computed(
		() => connectionState.value === signalR.HubConnectionState.Reconnecting,
	)

	const messageHandlers = ref<Array<(notification: ChatNotification) => void>>(
		[],
	)

	const connect = async () => {
		if (connection.value?.state === signalR.HubConnectionState.Connected) {
			return
		}

		if (!tokenInfo.value?.token) {
			return
		}

		try {
			connection.value = new signalR.HubConnectionBuilder()
				.withUrl(config.public.signalrHubUrl, {
					accessTokenFactory: () => tokenInfo.value?.token || '',
				})
				.withAutomaticReconnect({
					nextRetryDelayInMilliseconds: (retryContext) => {
						if (retryContext.elapsedMilliseconds < 60000) {
							return Math.random() * 10000
						} else {
							return null
						}
					},
				})
				.configureLogging(signalR.LogLevel.Information)
				.build()

			connection.value.onreconnecting((error) => {
				console.log('SignalR: Reconnecting...', error)
				connectionState.value = signalR.HubConnectionState.Reconnecting
			})

			connection.value.onreconnected(() => {
				connectionState.value = signalR.HubConnectionState.Connected
			})

			connection.value.onclose((error) => {
				console.log('SignalR: Connection closed', error)
				connectionState.value = signalR.HubConnectionState.Disconnected
			})

			connection.value.on(
				'ReceiveMessage',
				(notification: ChatNotification) => {
					messageHandlers.value.forEach((handler) => handler(notification))
				},
			)

			connectionState.value = signalR.HubConnectionState.Connecting
			await connection.value.start()
			connectionState.value = signalR.HubConnectionState.Connected
		} catch (error) {
			console.error('SignalR: Connection failed', error)
			connectionState.value = signalR.HubConnectionState.Disconnected
			throw error
		}
	}

	const disconnect = async () => {
		if (connection.value) {
			try {
				await connection.value.stop()
			} catch (error) {
				console.error('SignalR: Disconnect failed', error)
			} finally {
				connection.value = null
				connectionState.value = signalR.HubConnectionState.Disconnected
			}
		}
	}

	const joinChat = async (chatId: string) => {
		if (!isConnected.value) {
			return
		}

		try {
			await connection.value?.invoke('JoinChat', chatId)
		} catch (error) {
			console.error(`SignalR: Failed to join chat ${chatId}`, error)
			throw error
		}
	}

	const leaveChat = async (chatId: string) => {
		if (!isConnected.value) {
			return
		}

		try {
			await connection.value?.invoke('LeaveChat', chatId)
		} catch (error) {
			console.error(`SignalR: Failed to leave chat ${chatId}`, error)
			throw error
		}
	}

	const sendMessage = async (chatId: string, text: string) => {
		if (!isConnected.value) {
			console.error('SignalR: Cannot send message - not connected')
			throw new Error('Not connected to SignalR')
		}

		try {
			await connection.value?.invoke('SendMessage', chatId, text)
		} catch (error) {
			console.error(`SignalR: Failed to send message to chat ${chatId}`, error)
			throw error
		}
	}

	const onReceiveMessage = (
		callback: (notification: ChatNotification) => void,
	) => {
		messageHandlers.value.push(callback)

		return () => {
			const index = messageHandlers.value.indexOf(callback)
			if (index > -1) {
				messageHandlers.value.splice(index, 1)
			}
		}
	}

	onUnmounted(() => {
		disconnect()
		messageHandlers.value = []
	})

	return {
		connection: readonly(connection),
		connectionState: readonly(connectionState),
		isConnected,
		isConnecting,
		isReconnecting,
		connect,
		disconnect,
		joinChat,
		leaveChat,
		sendMessage,
		onReceiveMessage,
	}
}
