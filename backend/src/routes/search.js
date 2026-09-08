import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { search, suggest } from '../controllers/searchController.js'

export const searchRouter = Router()

searchRouter.get('/suggest', asyncHandler(suggest))
searchRouter.get('/', asyncHandler(search))