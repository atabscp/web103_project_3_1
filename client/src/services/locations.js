import apiClient from './api'

export const getLocations = () => apiClient.get('/locations')

export const getLocationBySlug = (slug) => apiClient.get(`/locations/${slug}`)

export const getLocationEvents = (slug) => apiClient.get(`/locations/${slug}/events`)
