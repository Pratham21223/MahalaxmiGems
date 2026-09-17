import { Router } from 'express'
import { LAB_REPORTS } from '../config/labReports.js'

export const labsRouter = Router()

// Public list of laboratory report options shown at checkout.
labsRouter.get('/', (_req, res) => {
  res.json({ items: LAB_REPORTS.map(({ id, label, fee }) => ({ id, label, fee })) })
})
