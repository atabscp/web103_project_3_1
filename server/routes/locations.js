import { Router } from 'express'
import { pool } from '../config/database.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `
        SELECT
          id,
          slug,
          name,
          description,
          address,
          city,
          state,
          zip,
          sport,
          hero_image
        FROM locations
        ORDER BY name;
      `
    )

    res.json(rows)
  } catch (error) {
    next(error)
  }
})

router.get('/:slug', async (req, res, next) => {
  const { slug } = req.params

  try {
    const locationQuery = `
      SELECT
        id,
        slug,
        name,
        description,
        address,
        city,
        state,
        zip,
        sport,
        hero_image
      FROM locations
      WHERE slug = $1;
    `

    const { rows } = await pool.query(locationQuery, [slug])

    if (rows.length === 0) {
      return res.status(404).json({ message: `Location with slug "${slug}" not found.` })
    }

    const location = rows[0]

    const eventsQuery = `
      SELECT
        id,
        location_id,
        title,
        description,
        start_time,
        price,
        image
      FROM events
      WHERE location_id = $1
      ORDER BY start_time;
    `

    const eventsResult = await pool.query(eventsQuery, [location.id])

    res.json({
      ...location,
      events: eventsResult.rows
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:slug/events', async (req, res, next) => {
  const { slug } = req.params

  try {
    const locationResult = await pool.query(
      'SELECT id FROM locations WHERE slug = $1;',
      [slug]
    )

    if (locationResult.rows.length === 0) {
      return res.status(404).json({ message: `Location with slug "${slug}" not found.` })
    }

    const locationId = locationResult.rows[0].id

    const eventsResult = await pool.query(
      `
        SELECT
          id,
          location_id,
          title,
          description,
          start_time,
          price,
          image
        FROM events
        WHERE location_id = $1
        ORDER BY start_time;
      `,
      [locationId]
    )

    res.json(eventsResult.rows)
  } catch (error) {
    next(error)
  }
})

export default router
