import { logger } from '../config/logger.js'

export function errorHandler(err, req, res, next) {
  logger.error(err.message)
  res.status(err.status || 500).json({ error: 'Internal server error' })
}