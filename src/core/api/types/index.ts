export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  signal?: AbortSignal
  params?: Record<string, string | number | boolean | undefined>
  skipAuth?: boolean
  headers?: Record<string, string>
}
