import { get } from 'svelte/store'

import { authStore } from '$lib/stores/authStore'
import { isTokenExpired, logout, refreshToken } from '$lib/services/authService'

interface ApiRequestOptions {
  endpoint: string
  method?: string
  body?: any
  headers?: Record<string, string>
}

export const apiService = async <T>(options: ApiRequestOptions, useAuth = true): Promise<T> => {
  const {
    endpoint,
    method = 'GET',
    body = null,
    headers = {}
  } = options


  const defaultHeaders: Record<string, any> = {
    'Content-Type': 'application/json',
    ...headers
  }

  if (useAuth) {
    // check if token is expired and refresh it before the request
    if (isTokenExpired()) {
      await refreshToken()
    }

    const token = get(authStore).token
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : null
  })

  // handle unauthorized error
  if (response.status === 401) {
    logout()
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const responseText = await response.text()

    let errorMessage = responseText || response.statusText || 'Something went wrong'
    try {
      const errorText = JSON.parse(responseText)
      errorMessage = errorText?.error || errorText?.message || errorMessage
    } catch {
      // JSON.parse failed, use the original responseText
    }
    throw new Error(errorMessage)
  }

  const responseText = await response.text()
  return responseText ? JSON.parse(responseText) : {} as T
}

