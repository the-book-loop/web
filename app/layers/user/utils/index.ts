export const fmtTicketCreationDate = (dateString: Date): string => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

export const fmtTicketStatus = (status: 0 | 1 | 2): string => {
	switch (status) {
		case 0:
			return 'Open'
		case 1:
			return 'In Progress'
		case 2:
			return 'Resolved'
		default:
			return 'Unknown'
	}
}

export const fmtResponseDate = (date: Date | null) => {
	if (!date) return ''

	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export const getTicketStatusColor = (status: 0 | 1 | 2): string => {
	switch (status) {
		case 0:
			return 'bg-yellow-100 text-yellow-800'
		case 1:
			return 'bg-blue-100 text-blue-800'
		case 2:
			return 'bg-green-100 text-green-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}
