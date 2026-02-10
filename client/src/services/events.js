import apiClient from './api'

export const getEvents = (params = {}) => {
  const searchParams = new URLSearchParams()

  if (params.location) {
    searchParams.set('location', params.location)
  }

  if (params.sport) {
    searchParams.set('sport', params.sport)
  }

  const query = searchParams.toString()
  const suffix = query ? `?${query}` : ''

  return apiClient.get(`/events${suffix}`)
}

export const getEventById = (id) => apiClient.get(`/events/${id}`)
