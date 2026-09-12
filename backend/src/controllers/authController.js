import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { registerSchema, loginSchema } from '../schemas.js'
import { validate } from '../middlewares/validate.js'
import { mergeGuestCartIntoUser } from '../utils/cart.js'
import { logger } from '../config/logger.js'
import { env } from '../config/index.js'

const BCRYPT_COST = 12

export function toPublicUser(u) {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
  }
}

export const validateRegister = validate(registerSchema)
export const validateLogin = validate(loginSchema)

export async function register(req, res) {
  const { name, email, password } = res.locals.validated
  const existing = await User.findOne({ email }).lean()
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST)
  const user = await User.create({ name, email, passwordHash })
  const guestId = req.session.guestId

  // Regenerate the session on privilege establishment (anti-fixation).
  req.session.regenerate((err) => {
    if (err) throw err
    req.session.userId = String(user._id)
    if (guestId) {
      try {
        mergeGuestCartIntoUser(guestId, String(user._id))
      } catch (e) {
        logger.warn({ err: e.message }, 'guest cart merge failed on register')
      }
    }
    req.session.save(() => {
      res.status(201).json({ user: toPublicUser(user) })
    })
  })
}

export async function login(req, res) {
  const { email, password } = res.locals.validated
  const user = await User.findOne({ email }).select('+passwordHash')
  const ok = user && (await bcrypt.compare(password, user.passwordHash))
  if (!ok) {
    logger.info({ event: 'auth.login_failed', email }, 'failed login')
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const guestId = req.session.guestId

  req.session.regenerate(async (err) => {
    if (err) throw err
    req.session.userId = String(user._id)
    if (guestId) {
      try {
        await mergeGuestCartIntoUser(guestId, String(user._id))
      } catch (e) {
        logger.warn({ err: e.message }, 'guest cart merge failed')
      }
    }
    req.session.save(() => {
      logger.info({ event: 'auth.login', userId: String(user._id) }, 'login')
      res.json({ user: toPublicUser(user) })
    })
  })
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie(env.sessionCookieName)
    res.status(204).end()
  })
}

export function me(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
  res.json({ user: toPublicUser(req.user) })
}
