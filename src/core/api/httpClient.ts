import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { appConfig } from '@/core/config/appConfig'
import { ApiError } from './apiError'
import { CORRELATION_HEADER_NAME, createCorrelationId } from './correlation'
import { isApiEnvelope, unwrapApiEnvelope, type ApiEnvelope } from './apiEnvelope'
import type { RequestOptions } from './types'
import { getAccessToken } from '@/core/auth/auth0'
import { readSelectedTenantIdsCSV } from '@/modules/tenants/store/tenantStore'
import { readSelectedBranchId } from '@/modules/branches/store/branchStore'

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

      if (!headers[appConfig.api.tenantHeaderName]) {
        const tenantIdCsv = readSelectedTenantIdsCSV()
        // Never send Guid.Empty or placeholders. Header must represent exactly one active tenant.
        if (tenantIdCsv && tenantIdCsv !== '00000000-0000-0000-0000-000000000000') {
          headers[appConfig.api.tenantHeaderName] = tenantIdCsv
        }
      }

      if (!headers['X-Branch-Id']) {
        const branchId = readSelectedBranchId()
        if (branchId && branchId !== '00000000-0000-0000-0000-000000000000') {
          headers['X-Branch-Id'] = branchId
        }
      }

      // Clean up params - remove any empty GUIDs, nulls, or empty strings
      if (config.params) {
        Object.keys(config.params).forEach((key) => {
          const val = config.params[key]
          if (
            val === '00000000-0000-0000-0000-000000000000' ||
            val === '' ||
            val === null ||
            val === undefined
          ) {
            delete config.params[key]
          }
        })
      }

      if (!config.skipAuth) {
        if (appConfig.auth.devBypass) {
          headers['X-Dev-User-Id'] = appConfig.auth.devUserId
        } else {
          const accessToken = await getAccessToken()
          if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`
          }
        }
      }

      // Development Diagnostic Logging
      if (import.meta.env.DEV) {
        const isContributionRequest = config.url?.includes('/contributions')
        if (isContributionRequest) {
          console.debug(`[HTTP][CONTRIBUTION_DEBUG] ${config.method?.toUpperCase()} ${config.url}`, {
            queryParams: config.params,
            tenantId: headers[appConfig.api.tenantHeaderName],
            hasAuth: !!headers.Authorization,
            hasDevUser: !!headers['X-Dev-User-Id'],
            branchId: headers['X-Branch-Id'],
          })
        } else {
          console.debug(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, {
            hasAuth: !!headers.Authorization,
            hasDevUser: !!headers['X-Dev-User-Id'],
            tenantId: headers[appConfig.api.tenantHeaderName],
          })
        }
      }

      config.headers = headers
      return config
    })
  }

  async get<T>(url: string, options?: RequestOptions): Promise<ApiEnvelope<T>> {
    return this.request<T>(mergeRequestOptions({ method: 'GET', url }, options))
  }

  async post<T, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: RequestOptions,
  ): Promise<ApiEnvelope<T>> {
    return this.request<T>(mergeRequestOptions({ method: 'POST', url, data }, options))
  }

  async put<T, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: RequestOptions,
  ): Promise<ApiEnvelope<T>> {
    return this.request<T>(mergeRequestOptions({ method: 'PUT', url, data }, options))
  }

  async patch<T, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: RequestOptions,
  ): Promise<ApiEnvelope<T>> {
    return this.request<T>(mergeRequestOptions({ method: 'PATCH', url, data }, options))
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<ApiEnvelope<T>> {
    return this.request<T>(mergeRequestOptions({ method: 'DELETE', url }, options))
  }

  async request<T>(config: InternalAxiosRequestConfig): Promise<ApiEnvelope<T>> {
    try {
      const response = await this.client.request<ApiEnvelope<T> | T>(config)
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
      throw mapApiError(error)
    }
  }
}

function mergeRequestOptions(config: any, options?: RequestOptions): InternalAxiosRequestConfig {
  return {
    ...config,
    signal: options?.signal,
    params: options?.params,
    headers: {
      ...(config.headers ?? {}),
      ...(options?.headers ?? {}),
    },
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
