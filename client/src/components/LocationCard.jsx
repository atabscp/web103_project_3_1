import React from 'react'
import { Link } from 'react-router-dom'
import '../css/Locations.css'

const LocationCard = ({ location }) => {
  const { slug, name, hero_image: heroImage, description, city, state, sport } = location

  return (
    <Link to={`/locations/${slug}`} className='location-card' role='listitem'>
      <div className='location-card__image'>
        <img src={heroImage} alt={`${name} venue`} loading='lazy' />
      </div>

      <div className='location-card__body'>
        <span className='location-card__sport'>{sport}</span>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>

      <footer className='location-card__footer'>
        <span>{city}, {state}</span>
        <span className='location-card__cta'>View events →</span>
      </footer>
    </Link>
  )
}

export default LocationCard
