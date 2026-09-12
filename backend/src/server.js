import { env } from './config/index.js'
import { logger } from './config/logger.js'
import { connectDB } from './config/db.js'
import { ensureAdmin } from './services/bootstrapAdmin.js'
import { createApp } from './app.js'

async function start() {
  try {
    if (env.isProd && !process.env.SESSION_SECRET) {
      logger.warn('SESSION_SECRET is not set — using an insecure default. Set it before going live.')
    }
    await connectDB(env.mongodbUri)
    logger.info('Connected to MongoDB')
    await ensureAdmin()
    const app = createApp()
    app.listen(env.port, () => logger.info(`API listening on :${env.port}`))
  } catch (err) {
    logger.error(err.message)
    process.exit(1)
  }
}

start()