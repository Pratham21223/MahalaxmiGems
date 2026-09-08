import express from 'express'
import cors from 'cors'
import { env } from './config/index.js'
import { logger } from './config/logger.js'
import { connectDB } from './config/db.js'
import { categoriesRouter } from './routes/categories.js'
import { productsRouter } from './routes/products.js'
import { searchRouter } from './routes/search.js'
import { reviewsRouter } from './routes/reviews.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import morgan from 'morgan';
const app = express()
app.use(cors({ origin: env.corsOrigin }))
app.use(express.json())
app.use(morgan("dev"));

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/search', searchRouter)
app.use('/api/reviews', reviewsRouter)

app.use(notFound)
app.use(errorHandler)

async function start() {
  try {
    await connectDB(env.mongodbUri)
    logger.info('Connected to MongoDB');
    app.listen(env.port, () => logger.info(`API listening on :${env.port}`))
  } catch (err) {
    logger.error(err.message)
    process.exit(1)
  }
}

start()