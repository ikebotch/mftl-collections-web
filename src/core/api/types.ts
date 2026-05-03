export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, any>
  signal?: AbortSignal
  skipAuth?: boolean
  skipTenant?: boolean
}

export interface PagedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
