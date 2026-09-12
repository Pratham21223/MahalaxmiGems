import { User } from '../models/User.js'

// attachUser: cheaply exposes the session's user id (if any) as req.user without
// a DB round-trip, so cart/order ownership can be resolved for guests and users
// alike. Full user details are only fetched by requireAuth/requireAdmin/me.
export function attachUser(req, _res, next) {
  if (req.session?.userId) {
    req.user = { _id: req.session.userId }
  }
  next()
}

// requireAuth: deny unauthenticated requests (safe errors, no details leaked).
export async function requireAuth(req, res, next) {
  const userId = req.session?.userId
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  const user = await User.findById(userId).lean()
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  req.user = user
  next()
}

// requireAdmin: role-based access control, deny-by-default (backend-principles).
export async function requireAdmin(req, res, next) {
  const userId = req.session?.userId
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  const user = await User.findById(userId).lean()
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  req.user = user
  next()
}