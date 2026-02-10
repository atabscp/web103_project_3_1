import React, { useEffect, useMemo, useState } from 'react'
import Event from '../components/Event'
import { getEvents } from '../services/events'
import { getLocations } from '../services/locations'
import '../css/Event.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [locations, setLocations] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortOrder, setSortOrder] = useState('upcoming')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations()
        setLocations(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchLocations()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setStatus('loading')
        const response = await getEvents(selectedLocation === 'all' ? {} : { location: selectedLocation })
        setEvents(response)
        setStatus('ready')
      } catch (err) {
        console.error(err)
        setError('Unable to load events. Please try again.')
        setStatus('error')
      }
    }

    fetchEvents()
  }, [selectedLocation])

  const sortedEvents = useMemo(() => {
    const list = [...events]

    if (sortOrder === 'recent') {
      return list.sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
    }

    return list.sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
  }, [events, sortOrder])

  return (
    <section className='events-view'>
      <header className='events-view__header'>
        <div>
          <span className='events-view__label'>Full schedule</span>
          <h2>See every event across UnityGrid Plaza.</h2>
          <p>Filter by location to jump into a specific venue or sort to surface the next big moment.</p>
        </div>

        <div className='events-view__filters'>
          <label htmlFor='location-filter'>
            Location
            <select
              id='location-filter'
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
            >
              <option value='all'>All venues</option>
              {locations.map((location) => (
                <option key={location.id} value={location.slug}>{location.name}</option>
              ))}
            </select>
          </label>

          <label htmlFor='sort-order'>
            Sort by
            <select
              id='sort-order'
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value='upcoming'>Soonest first</option>
              <option value='recent'>Most recent first</option>
            </select>
          </label>
        </div>
      </header>

      {status === 'loading' && <p className='events-view__status'>Loading events...</p>}
      {status === 'error' && <p className='events-view__status events-view__status--error'>{error}</p>}

      {status === 'ready' && (
        <div className='events-grid'>
          {sortedEvents.map((event) => (
            <Event key={event.id} event={event} showLocation />
          ))}

          {sortedEvents.length === 0 && (
            <p className='events-view__status'>No events match your filters.</p>
          )}
        </div>
      )}
    </section>
  )
}

export default Events
