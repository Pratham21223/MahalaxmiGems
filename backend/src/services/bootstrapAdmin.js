import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { env } from '../config/index.js'
import { logger } from '../config/logger.js'

// Creates the first admin user from ADMIN_EMAIL / ADMIN_PASSWORD if configured
// and no admin exists yet. Idempotent; never resets an existing admin.
export async function ensureAdmin() {
  if (!env.adminEmail || !env.adminPassword) return
  const existing = await User.findOne({ role: 'admin' })
  if (existing) return
  const passwordHash = await bcrypt.hash(env.adminPassword, 12)
  await User.create({
    name: 'Admin',
    email: env.adminEmail,
    passwordHash,
    role: 'admin',
  })
  logger.info({ event: 'admin.bootstrap' }, 'Admin user created')
}
