import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { requireAdmin } from '../middlewares/auth.js'
import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminListProducts,
  adminGetProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  adminUpdateLabReportStatus,
  validateCategory,
  validateProduct,
  validateOrderStatus,
  validateLabReportStatus,
} from '../controllers/adminController.js'
import {
  adminListContactMessages,
  adminUpdateContactStatus,
  validateContactStatus,
} from '../controllers/contactController.js'

export const adminRouter = Router()

adminRouter.use(requireAdmin)

adminRouter.get('/categories', asyncHandler(adminListCategories))
adminRouter.post('/categories', validateCategory, asyncHandler(adminCreateCategory))
adminRouter.put('/categories/:id', validateCategory, asyncHandler(adminUpdateCategory))
adminRouter.delete('/categories/:id', asyncHandler(adminDeleteCategory))

adminRouter.get('/products', asyncHandler(adminListProducts))
adminRouter.get('/products/:id', asyncHandler(adminGetProduct))
adminRouter.post('/products', validateProduct, asyncHandler(adminCreateProduct))
adminRouter.put('/products/:id', validateProduct, asyncHandler(adminUpdateProduct))
adminRouter.delete('/products/:id', asyncHandler(adminDeleteProduct))

adminRouter.get('/orders', asyncHandler(adminListOrders))
adminRouter.get('/orders/:reference', asyncHandler(adminGetOrder))
adminRouter.patch('/orders/:reference/status', validateOrderStatus, asyncHandler(adminUpdateOrderStatus))
adminRouter.patch('/orders/:reference/lab-report', validateLabReportStatus, asyncHandler(adminUpdateLabReportStatus))

adminRouter.get('/contact-messages', asyncHandler(adminListContactMessages))
adminRouter.patch('/contact-messages/:id/status', validateContactStatus, asyncHandler(adminUpdateContactStatus))
