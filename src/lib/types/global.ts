/**
 * The value MUST exist, but can be undefined
 */
export type Maybe<T> = T | undefined

/**
 * The value can have NULL value
 */
export type Nullable<T> = T | null

export interface PagePagination {
  page?: number
  size?: number
}

export interface Paginated<T> {
  items: T
  totalCount: number
}

export interface Breadcrumb {
  link: string
  title: string
}

