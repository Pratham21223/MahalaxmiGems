import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { requireAuth } from '../middlewares/auth.js'
import { validateCreateReview } from '../middlewares/validate.js'
import { listReviews, createReview } from '../controllers/reviewController.js'

export const reviewsRouter = Router()

reviewsRouter.get('/', asyncHandler(listReviews))
reviewsRouter.post('/', requireAuth, validateCreateReview, asyncHandler(createReview))