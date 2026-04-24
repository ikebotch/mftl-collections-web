import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { appConfig } from '@/core/config/appConfig'
import { ApiError } from './apiError'
import { CORRELATION_HEADER_NAME, createCorrelationId } from './correlation'
import { isApiEnvelope, unwrapApiEnvelope, type ApiEnvelope } from './apiEnvelope'
import type { RequestOptions } from './types'
import { getAccessToken } from '@/core/auth/auth0'
import { readSelectedTenantId } from '@/modules/tenants/store/tenantStore'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean
  }
}

export class HttpClient {
  readonly client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: appConfig.api.versionedBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.request.use(async (config) => {
      const headers = config.headers ?? {}
      headers[CORRELATION_HEADER_NAME] = createCorrelationId()

      const tenantId = readSelectedTenantId()
      if (tenantId) {
        headers[appConfig.api.tenantHeaderName] = tenantId
      }

      if (!config.skipAuth && !appConfig.auth.devBypass) {
        const accessToken = await getAccessToken()
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`
        }
      } else if (appConfig.auth.devBypass) {
        // In dev bypass mode, we might want to log or attach a mock token
        console.debug('[HttpClient] Auth0 bypass enabled. Skipping token attachment.')
      }

      config.headers = headers
      return config
    })
  }

  async get<T>(url: string, options?: RequestOptions): Promise<ApiEnvelope<T>> {
    return this.request<T>({ ...options, method: 'GET', url })
  }

  async post<T, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: RequestOptions,
  ): Promise<ApiEnvelope<T>> {
    return this.request<T>({ ...options, method: 'POST', url, data })
  }

  async put<T, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: RequestOptions,
  ): Promise<ApiEnvelope<T>> {
    return this.request<T>({ ...options, method: 'PUT', url, data })
  }

  async patch<T, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: RequestOptions,
  ): Promise<ApiEnvelope<T>> {
    return this.request<T>({ ...options, method: 'PATCH', url, data })
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<ApiEnvelope<T>> {
    return this.request<T>({ ...options, method: 'DELETE', url })
  }

  async request<T>(config: AxiosRequestConfig): Promise<ApiEnvelope<T>> {
    const startTime = Date.now()
    try {
      const response = await this.client.request<ApiEnvelope<T> | T>(config)
      
      if (appConfig.api.debug) {
        const duration = Date.now() - startTime
        console.group(`[API] ${config.method?.toUpperCase()} ${config.url} (${response.status}) [${duration}ms]`)
        console.log('Response:', response.data)
        console.log('Correlation ID:', response.headers[CORRELATION_HEADER_NAME])
        console.groupEnd()
      }

      if (isApiEnvelope<T>(response.data)) {
        const envelope = unwrapApiEnvelope(response.data)
        if (!envelope.success) {
          throw new ApiError({
            message: envelope.message || 'Request failed.',
            statusCode: response.status,
            errors: envelope.errors,
            correlationId: envelope.correlationId,
          })
        }

        return envelope
      }

      return {
        success: true,
        message: '',
        data: response.data as T,
        errors: [],
        correlationId: String(response.headers[CORRELATION_HEADER_NAME] ?? ''),
      }
    } catch (error) {
      if (appConfig.api.debug) {
        const duration = Date.now() - startTime
        const axiosError = axios.isAxiosError(error) ? error : null
        console.group(`[API Error] ${config.method?.toUpperCase()} ${config.url} [${duration}ms]`)
        if (axiosError) {
          console.error('Status:', axiosError.response?.status)
          console.error('Data:', axiosError.response?.data)
          console.error('Correlation ID:', axiosError.response?.headers?.[CORRELATION_HEADER_NAME])
        } else {
          console.error('Error:', error)
        }
        console.groupEnd()
      }
      throw mapApiError(error)
    }
  }
}

export function mapApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiEnvelope<unknown>>
    const envelope = axiosError.response?.data

    if (envelope && isApiEnvelope(envelope)) {
      const normalized = unwrapApiEnvelope(envelope)
      return new ApiError({
        message: normalized.message || axiosError.message,
        statusCode: axiosError.response?.status,
        errors: normalized.errors,
        correlationId: normalized.correlationId,
      })
    }

    return new ApiError({
      message: axiosError.message,
      statusCode: axiosError.response?.status,
      errors: [],
      correlationId: String(axiosError.response?.headers?.[CORRELATION_HEADER_NAME] ?? ''),
    })
  }

  return new ApiError({
    message: error instanceof Error ? error.message : 'Unknown API error.',
  })
}

export const httpClient = new HttpClient()
