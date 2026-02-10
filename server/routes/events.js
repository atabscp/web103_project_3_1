import { Router } from 'express'
import { pool } from '../config/database.js'

const router = Router()

router.get('/', async (req, res, next) => {
  const { location: locationSlug, sport } = req.query

  try {
    const filters = []
    const values = []

    if (locationSlug) {
      values.push(locationSlug)
      filters.push(`l.slug = $${values.length}`)
    }

    if (sport) {
      values.push(sport)
      filters.push(`LOWER(l.sport) = LOWER($${values.length})`)
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''

    const query = `
      SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.price,
        e.image,
        l.id AS location_id,
        l.slug AS location_slug,
        l.name AS location_name,
        l.sport AS location_sport,
        l.hero_image AS location_image
      FROM events e
      JOIN locations l ON e.location_id = l.id
      ${whereClause}
      ORDER BY e.start_time;
    `

    const { rows } = await pool.query(query, values)

    res.json(rows)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const query = `
      SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.price,
        e.image,
        l.id AS location_id,
        l.slug AS location_slug,
        l.name AS location_name,
        l.sport AS location_sport,
        l.hero_image AS location_image
      FROM events e
      JOIN locations l ON e.location_id = l.id
      WHERE e.id = $1;
    `

    const { rows } = await pool.query(query, [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: `Event with id "${id}" not found.` })
    }

    res.json(rows[0])
  } catch (error) {
    next(error)
  }
})

export default router
