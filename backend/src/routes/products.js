import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { listProducts, getProductById } from '../controllers/productController.js'

export const productsRouter = Router()

productsRouter.get('/', asyncHandler(listProducts))
productsRouter.get('/:id', asyncHandler(getProductById))