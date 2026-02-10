import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Event.css'

const formatEventDate = (value) => {
  const date = new Date(value)

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })

  return `${dateFormatter.format(date)} • ${timeFormatter.format(date)}`
}

const formatPrice = (price) => {
  if (price == null) return 'Free'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(price))
}

const getCountdown = (startTime) => {
  const start = new Date(startTime).getTime()
  const now = Date.now()
  const difference = start - now

  const direction = difference >= 0 ? 'future' : 'past'
  const absolute = Math.abs(difference)
  const totalSeconds = Math.floor(absolute / 1000)

  if (totalSeconds === 0) {
    return {
      label: 'Starting now',
      direction
    }
  }

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0 || days > 0) parts.push(`${hours}h`)
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)

  const descriptor = parts.slice(0, 3).join(' ')

  return {
    label: direction === 'future'
      ? `Starts in ${descriptor}`
      : `Ended ${descriptor} ago`,
    direction
  }
}

const Event = ({ event, showLocation = false }) => {
  const {
    title,
    description,
    start_time: startTime,
    price,
    image,
    location_name: locationName,
    location_slug: locationSlug,
    location_sport: locationSport
  } = event

  const [countdown, setCountdown] = useState(() => getCountdown(startTime))

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(getCountdown(startTime))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [startTime])

  const formattedDate = useMemo(() => formatEventDate(startTime), [startTime])
  const formattedPrice = useMemo(() => formatPrice(price), [price])
  const isPastEvent = countdown.direction === 'past'

  return (
    <article className={`event-card ${isPastEvent ? 'event-card--past' : ''}`}>
      <div className='event-card__image'>
        <img src={image} alt={title} loading='lazy' />
        <span className={`event-card__badge ${isPastEvent ? 'event-card__badge--past' : 'event-card__badge--upcoming'}`}>
          {isPastEvent ? 'Past event' : 'Upcoming'}
        </span>
      </div>

      <div className='event-card__content'>
        {showLocation && locationName && (
          <div className='event-card__location'>
            <span>{locationSport}</span>
            <Link to={`/locations/${locationSlug}`}>{locationName}</Link>
          </div>
        )}

        <h3>{title}</h3>
        {description && <p className='event-card__description'>{description}</p>}

        <div className='event-card__meta'>
          <span>{formattedDate}</span>
          <span>{formattedPrice}</span>
        </div>

        <div className={`event-card__countdown ${isPastEvent ? 'event-card__countdown--past' : ''}`}>
          {countdown.label}
        </div>
      </div>
    </article>
  )
}

export default Event
