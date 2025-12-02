export const fmtExchangeStatus = (status: number): string => {
	switch (status) {
		case 0:
			return 'Pending'
		case 1:
			return 'Accepted'
		case 2:
			return 'Declined'
		default:
			return 'Unknown'
	}
}
