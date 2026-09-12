import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import {
  getCartHandler,
  addItem,
  updateItem,
  removeItem,
  validateAdd,
  validateUpdate,
} from '../controllers/cartController.js'

export const cartRouter = Router()

cartRouter.get('/', asyncHandler(getCartHandler))
cartRouter.post('/', validateAdd, asyncHandler(addItem))
cartRouter.patch('/:productId', validateUpdate, asyncHandler(updateItem))
cartRouter.delete('/:productId', asyncHandler(removeItem))
