import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { requireAuth } from '../middlewares/auth.js'
import {
  listWishlist,
  addWishlist,
  removeWishlist,
  validateWishlist,
} from '../controllers/wishlistController.js'

export const wishlistRouter = Router()

wishlistRouter.use(requireAuth)
wishlistRouter.get('/', asyncHandler(listWishlist))
wishlistRouter.post('/', validateWishlist, asyncHandler(addWishlist))
wishlistRouter.delete('/:productId', asyncHandler(removeWishlist))
