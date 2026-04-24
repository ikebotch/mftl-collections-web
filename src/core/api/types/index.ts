export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  signal?: AbortSignal
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
}
