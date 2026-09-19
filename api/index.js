import { createApp } from '../backend/src/app.js'
import { connectDB } from '../backend/src/config/db.js'
import { env } from '../backend/src/config/index.js'
import { ensureAdmin } from '../backend/src/services/bootstrapAdmin.js'

let appPromise = null

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      await connectDB(env.mongodbUri)
      await ensureAdmin()
      return createApp()
    })()
  }
  return appPromise
}

function resolveUrl(req) {
  // If req.url is already a specific sub-path (e.g. /api/products or /health), keep it
  if (req.url && req.url !== '/api' && req.url !== '/api/' && req.url !== '/api/index.js') {
    return req.url
  }

  // Check Vercel rewrite routing headers
  const headerPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri']
  if (headerPath) {
    const queryIndex = req.url.indexOf('?')
    const query = queryIndex !== -1 ? req.url.slice(queryIndex) : ''
    return headerPath + query
  }

  // Check wildcard query parameter from rewrite (/api/:match*)
  if (req.query && req.query.match) {
    const matchPath = Array.isArray(req.query.match) ? req.query.match.join('/') : req.query.match
    const queryIndex = req.url.indexOf('?')
    const query = queryIndex !== -1 ? req.url.slice(queryIndex) : ''
    return `/api/${matchPath}` + query
  }

  return req.url
}

export default async function handler(req, res) {
  try {
    const app = await getApp()
    req.url = resolveUrl(req)
    return app(req, res)
  } catch (err) {
    console.error('Serverless function error:', err)
    res.status(500).json({ error: 'Internal Server Error', message: err.message })
  }
}

