import 'dotenv/config'

export const env = {
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gemstone_store',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL || 'info',
}