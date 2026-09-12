import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { requireAuth } from '../middlewares/auth.js'
import {
  createCheckout,
  confirmPayment,
  getOrder,
  listMyOrders,
  cancelOrder,
  validateCheckout,
} from '../controllers/orderController.js'

export const ordersRouter = Router()

// Note: POST /api/orders/webhook is registered in app.js with a raw body parser
// (before the global JSON parser) so Razorpay's signature can be verified.
ordersRouter.get('/', requireAuth, asyncHandler(listMyOrders))
ordersRouter.post('/', validateCheckout, asyncHandler(createCheckout))
ordersRouter.post('/:reference/confirm', asyncHandler(confirmPayment))
ordersRouter.post('/:reference/cancel', asyncHandler(cancelOrder))
ordersRouter.get('/:reference', asyncHandler(getOrder))
