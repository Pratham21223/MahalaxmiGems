import pino from 'pino'
import { env } from './index.js'

export const logger = pino({ level: env.logLevel })