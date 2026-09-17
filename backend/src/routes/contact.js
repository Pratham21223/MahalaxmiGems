import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { contactLimiter } from '../middlewares/rateLimiter.js'
import { submitContact, validateContact } from '../controllers/contactController.js'

export const contactRouter = Router()

contactRouter.post('/', contactLimiter, validateContact, asyncHandler(submitContact))
