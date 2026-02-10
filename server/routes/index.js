import { Router } from 'express'
import locationsRouter from './locations.js'
import eventsRouter from './events.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/locations', locationsRouter)
router.use('/events', eventsRouter)

export default router
