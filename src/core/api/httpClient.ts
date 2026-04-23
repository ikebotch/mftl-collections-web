import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { appConfig } from '../config/appConfig'
import { useTenantStore } from '../stores/tenantStore'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: string[]
  correlationId?: string
}

export class ApiError extends Error {
  public statusCode?: number
  public errors?: string[]
  public correlationId?: string

  constructor(
    message: string,
    statusCode?: number,
    errors?: string[],
    correlationId?: string
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
    this.correlationId = correlationId
  }
}

const httpClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for Auth and Tenancy
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tenantStore = useTenantStore()
  
  if (tenantStore.currentTenantId) {
    config.headers[appConfig.api.tenantHeaderName] = tenantStore.currentTenantId
  }

  // Auth0 token attachment placeholder
  // This will be handled by a wrapper or a reactive state from the Auth0 plugin
  
  return config
})

// Response interceptor for envelope parsing
httpClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse
    if (!data.success) {
      throw new ApiError(
        data.message || 'API Request Failed',
        response.status,
        data.errors,
        data.correlationId
      )
    }
    return response
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const data = error.response.data
      throw new ApiError(
        data?.message || error.message,
        error.response.status,
        data?.errors,
        data?.correlationId
      )
    }
    throw new ApiError(error.message)
  }
)

export default httpClient
