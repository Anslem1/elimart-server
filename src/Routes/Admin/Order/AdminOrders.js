const {
  updateOrder,
  getCustomersOrders
} = require('../../../Controllers/Admin/Order/AdminOrders')
const {
  createPageType,
  getpageTypes
} = require('../../../Controllers/Admin/PageType/PageType')
const {
  adminMiddleware,
  requireSignin
} = require('../../../Middlewares/middleware')

const router = require('express').Router()

router
  .post('/update', requireSignin, adminMiddleware, updateOrder)
  .get(
    '/getcustomerorders',
    requireSignin,
    adminMiddleware,
    getCustomersOrders
  )

module.exports = router
