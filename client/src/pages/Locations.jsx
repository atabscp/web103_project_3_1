import React, { useEffect, useState } from 'react'
import LocationCard from '../components/LocationCard'
import { getLocations } from '../services/locations'
import '../css/Locations.css'

const Locations = () => {
  const [locations, setLocations] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setStatus('loading')
        const data = await getLocations()
        setLocations(data)
        setStatus('ready')
      } catch (err) {
        console.error(err)
        setError('Unable to load venues. Please try again.')
        setStatus('error')
      }
    }

    fetchLocations()
  }, [])

  return (
    <section className='locations'>
      <div className='locations-hero'>
        <span className='locations-label'>Explore the grid</span>
        <h2>Select a venue to dive into upcoming and legendary matchups.</h2>
        <p>
          UnityGrid Plaza keeps football, soccer, hockey, and basketball fans in sync with
          the latest runs, scrimmages, and throwback events. Choose a location to see what&apos;s next.
        </p>
      </div>

      {status === 'loading' && <p className='locations-status'>Loading venues...</p>}
      {status === 'error' && <p className='locations-status locations-status--error'>{error}</p>}

      {status === 'ready' && (
        <div className='locations-grid' role='list'>
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Locations
