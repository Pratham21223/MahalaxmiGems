import mongoose from 'mongoose'
import { env } from './config/index.js'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import morgan from 'morgan'
import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDist = path.resolve(__dirname, '../../frontend/dist')

import { attachUser } from './middlewares/auth.js'
import { globalLimiter } from './middlewares/rateLimiter.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { handleWebhook } from './controllers/orderController.js'
import { asyncHandler } from './middlewares/asyncHandler.js'

import { categoriesRouter } from './routes/categories.js'
import { productsRouter } from './routes/products.js'
import { searchRouter } from './routes/search.js'
import { reviewsRouter } from './routes/reviews.js'
import { authRouter } from './routes/auth.js'
import { cartRouter } from './routes/cart.js'
import { wishlistRouter } from './routes/wishlist.js'
import { ordersRouter } from './routes/orders.js'
import { adminRouter } from './routes/admin.js'
import { labsRouter } from './routes/labs.js'
import { contactRouter } from './routes/contact.js'

// Defense-in-depth note: `mongoose.set('sanitizeFilter', true)` is intentionally
// NOT used — on this Mongoose version it breaks casting of operator range queries
// on embedded numeric paths (e.g. price/carat filters). Input is instead guarded
// by Zod allow-list validation + escapeRegex, and queries use Mongoose's
// parameterized API.

// App factory so tests can build an app after connecting to the test database.
// The session store shares Mongoose's MongoClient (no second connection, and the
// process exits cleanly when Mongoose disconnects).
export function createApp() {
  const app = express()
  app.disable('x-powered-by') //hides which framework is used for browsers

  // Security headers. Strict CSP is enforced in production; it is disabled in
  // dev so Vite's HMR (inline scripts + websocket) keeps working.
  app.use(
    helmet({
      contentSecurityPolicy: env.isProd
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", 'https://checkout.razorpay.com', 'https://api.razorpay.com'],
              connectSrc: ["'self'", 'https://api.razorpay.com', 'https://checkout.razorpay.com'],
              styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
              fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://fonts.googleapis.com'],
              imgSrc: ["'self'", 'data:', 'blob:'],
              objectSrc: ["'none'"],
              frameSrc: ['https://checkout.razorpay.com'],
              frameAncestors: ["'none'"],
              baseUri: ["'self'"],
            },
          }
        : false,
    }),
  )

  // CORS restricted to the known frontend origin, with credentials for the
  // session cookie (backend-principles.md).
  app.use(cors({ origin: env.corsOrigin, credentials: true }))

  app.use(cookieParser())

  // Server-side sessions stored in MongoDB (backend-principles: prefer sessions).
  app.use(
    session({
      name: env.sessionCookieName,
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ client: mongoose.connection.getClient(), touchAfter: 24 * 3600 }),
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.isProd,
        maxAge: env.sessionMaxAgeMs,
      },
    }),
  )

  // Attach the logged-in user to requests without blocking guests.
  app.use(attachUser)

  // Dev-only request logging (never in production).
  if (!env.isProd) app.use(morgan('dev'))

  app.use('/api', globalLimiter)

  app.get('/health', (req, res) => res.json({ status: 'ok' }))

  // Razorpay webhook needs the RAW body for HMAC verification, so it is mounted
  // before the global JSON parser below.
  app.post('/api/orders/webhook', express.raw({ type: '*/*' }), asyncHandler(handleWebhook))

  app.use(express.json({ limit: '100kb' }))

  app.use('/api/categories', categoriesRouter)
  app.use('/api/products', productsRouter)
  app.use('/api/search', searchRouter)
  app.use('/api/reviews', reviewsRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/cart', cartRouter)
  app.use('/api/wishlist', wishlistRouter)
  app.use('/api/orders', ordersRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api/labs', labsRouter)
  app.use('/api/contact', contactRouter)

  // In production (e.g. Docker container or standalone Node server),
  // serve frontend static assets if the built frontend dist exists.
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist))
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/health') {
        return next()
      }
      res.sendFile(path.join(clientDist, 'index.html'))
    })
  }

  app.use(notFound)
  app.use(errorHandler)

  return app
}