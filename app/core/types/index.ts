type Maybe<T> = T | null | undefined

type BaseEntity<T> = T & {
	id: string
	created: Date
	modified: Date
}

export type { Maybe, BaseEntity }
