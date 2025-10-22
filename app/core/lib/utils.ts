import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const capitalize = (s: string) => {
	return s.charAt(0).toUpperCase() + s.slice(1)
}
