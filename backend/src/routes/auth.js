import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authLimiter } from '../middlewares/rateLimiter.js'
import { requireAuth } from '../middlewares/auth.js'
import {
  register,
  login,
  logout,
  me,
  validateRegister,
  validateLogin,
} from '../controllers/authController.js'

export const authRouter = Router()

authRouter.post('/register', authLimiter, validateRegister, asyncHandler(register))
authRouter.post('/login', authLimiter, validateLogin, asyncHandler(login))
authRouter.post('/logout', logout)
authRouter.get('/me', requireAuth, asyncHandler(me))
