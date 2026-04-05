import axios, { AxiosInstance, AxiosError } from 'axios'

export interface HttpClientConfig {
  baseURL: string
  timeout?: number
}

export interface ApiError {
  status: number
  message: string
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'SERVER_ERROR' | 'NETWORK_ERROR'
  details?: string[]
}

export class HttpClient {
  private axiosInstance: AxiosInstance

  constructor(config: HttpClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable cookies for HttpOnly tokens
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('gaira_access_token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor: automatic token refresh on 401
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<{ message: string | string [] }>) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean }

        // If 401 and haven't retried yet: attempt token refresh
        if (error.response?.status === 401 && !originalRequest?._retry) {
          // If the request was to the login or register endpoint, do not attempt to refresh or redirect
          if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')) {
            const apiError = this.handleError(error)
            return Promise.reject(apiError)
          }

          originalRequest._retry = true

          const refreshToken = localStorage.getItem('gaira_refresh_token')
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post<{ accessToken: string; refreshToken: string }>(
                `${this.axiosInstance.defaults.baseURL}/auth/refresh`,
                { refreshToken },
                { withCredentials: true }
              )

              const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data
              localStorage.setItem('gaira_access_token', accessToken)
              localStorage.setItem('gaira_refresh_token', newRefreshToken)

              // Retry original request with the new token
              if (originalRequest?.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
              }
              return this.axiosInstance(originalRequest!)
            } catch {
              // Refresh failed: clear tokens and redirect to login
              localStorage.removeItem('gaira_access_token')
              localStorage.removeItem('gaira_refresh_token')
              window.location.href = '/login'
            }
          } else {
            // No refresh token: redirect to login
            localStorage.removeItem('gaira_access_token')
            window.location.href = '/login'
          }
        }

        const apiError = this.handleError(error)
        return Promise.reject(apiError)
      }
    )
  }

  private handleError(error: AxiosError<{ message: string | string[] }>): ApiError {
    if (!error.response) {
      return {
        status: 0,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        code: 'NETWORK_ERROR'
      }
    }

    const { status, data } = error.response
    let message = 'Ha ocurrido un error inesperado.'
    let details: string[] | undefined

    if (data?.message) {
      if (Array.isArray(data.message)) {
        details = data.message
        message = data.message[0]
      } else {
        message = data.message
      }
    }

    switch (status) {
      case 401:
        return {
          status,
          message,
          code: 'UNAUTHORIZED',
          details
        }
      case 403:
        return {
          status,
          message: 'No tienes permisos para realizar esta acción.',
          code: 'FORBIDDEN'
        }
      case 422:
        return {
          status,
          message,
          code: 'VALIDATION_ERROR',
          details
        }
      case 400:
        return {
          status,
          message,
          code: 'VALIDATION_ERROR',
          details
        }
      case 500:
        return {
          status,
          message: 'Error interno del servidor. Intenta de nuevo más tarde.',
          code: 'SERVER_ERROR'
        }
      default:
        return {
          status,
          message,
          code: 'SERVER_ERROR',
          details
        }
    }
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(url)
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data)
    return response.data
  }

  async delete<T = void>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url)
    return response.data
  }
}

// Shared HTTP client instance - singleton pattern
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const httpClient = new HttpClient({ baseURL: API_URL })