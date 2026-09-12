import 'dotenv/config'

// All runtime config is environment-driven with safe local defaults so the app
// runs without a .env for the catalog. Secrets used in production (sessions,
// payments, admin bootstrap) MUST be provided via environment variables.
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gemstone_store',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL || 'info',

  // Sessions (server-side, Mongo-backed). In production this must be a strong
  // random value kept out of the repo (never commit it).
  sessionSecret: process.env.SESSION_SECRET || 'dev-insecure-session-secret-change-me',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'sid',
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 24 * 7),

  // Payments (Razorpay test mode during development).
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',

  // Admin bootstrap credentials (only used to create the first admin user).
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
}
