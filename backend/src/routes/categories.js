import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { listCategories, getCategoryBySlug } from '../controllers/categoryController.js'

export const categoriesRouter = Router()

categoriesRouter.get('/', asyncHandler(listCategories))
categoriesRouter.get('/:slug', asyncHandler(getCategoryBySlug))