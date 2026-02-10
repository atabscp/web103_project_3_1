const DEFAULT_API_BASE_URL = '/api'
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
const apiBaseUrl = rawBaseUrl.replace(/\/$/, '')

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const error = new Error(errorBody.message || 'API request failed')
    error.status = response.status
    error.details = errorBody
    throw error
  }

  return response.json()
}

const apiClient = {
  async get(path) {
    const endpoint = path.startsWith('/') ? path : `/${path}`

    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return handleResponse(response)
  }
}

export default apiClient
