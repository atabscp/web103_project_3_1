import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Event from '../components/Event'
import { getLocationBySlug } from '../services/locations'
import '../css/LocationEvents.css'

const LocationEvents = () => {
  const { slug } = useParams()
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setStatus('loading')
        const data = await getLocationBySlug(slug)
        setLocation(data)
        setStatus('ready')
      } catch (err) {
        console.error(err)
        setError('We could not load this venue. Please try again.')
        setStatus('error')
      }
    }

    fetchLocation()
  }, [slug])

  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!location) {
      return { upcomingEvents: [], pastEvents: [] }
    }

    const now = Date.now()
    const sortedEvents = [...(location.events || [])]
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))

    const upcoming = []
    const past = []

    for (const event of sortedEvents) {
      if (new Date(event.start_time).getTime() >= now) {
        upcoming.push(event)
      } else {
        past.push(event)
      }
    }

    return {
      upcomingEvents: upcoming,
      pastEvents: past.reverse()
    }
  }, [location])

  if (status === 'loading') {
    return <p className='location-events__status'>Loading venue details...</p>
  }

  if (status === 'error') {
    return (
      <section className='location-events'>
        <p className='location-events__status location-events__status--error'>{error}</p>
        <Link to='/' role='button'>Back to venues</Link>
      </section>
    )
  }

  if (!location) return null

  const { name, hero_image: heroImage, description, address, city, state, zip, sport } = location

  return (
    <section className='location-events'>
      <header className='location-events__header'>
        <img src={heroImage} alt={`${name} venue`} className='location-events__image' />

        <div className='location-events__info'>
          <span className='location-events__sport'>{sport}</span>
          <h2>{name}</h2>
          <p>{description}</p>
          <p className='location-events__address'>{address}, {city}, {state} {zip}</p>
          <div className='location-events__actions'>
            <Link to='/' role='button' className='secondary'>Back to venues</Link>
            <Link to='/events' role='button'>All events</Link>
          </div>
        </div>
      </header>

      <section className='location-events__list'>
        <h3>Upcoming events</h3>
        {upcomingEvents.length === 0 && (
          <p className='location-events__empty'>No upcoming events scheduled. Check back soon!</p>
        )}
        <div className='location-events__grid'>
          {upcomingEvents.map((event) => (
            <Event key={event.id} event={event} showLocation={false} />
          ))}
        </div>
      </section>

      <section className='location-events__list'>
        <h3>Past highlights</h3>
        {pastEvents.length === 0 && (
          <p className='location-events__empty'>This venue is just getting started.</p>
        )}
        <div className='location-events__grid'>
          {pastEvents.map((event) => (
            <Event key={event.id} event={event} showLocation={false} />
          ))}
        </div>
      </section>
    </section>
  )
}

export default LocationEvents
