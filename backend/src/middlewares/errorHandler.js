import { logger } from '../config/logger.js'

// Safe error responses: never leak stack traces or internal details
// (backend-principles.md). Controlled 4xx errors carry an explicit `status` and
// client-safe message. 5xx responses are generic unless the error is explicitly
// marked `expose` (e.g. a safe payment-provider message).
export function errorHandler(err, req, res, next) {
  logger.error({ err: err.message, stack: err.stack }, 'request error')
  const status = err.status || 500
  const message =
    status >= 500 ? (err.expose ? err.message : 'Something went wrong, please try again') : err.message || 'Bad request'
  res.status(status).json({ error: message })
}