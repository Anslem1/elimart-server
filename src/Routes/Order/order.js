const {
  addOrder,
  getOrders,
  getOrder
} = require('../../Controllers/Order/Order')
const {
  requireSignin,
  userMiddleware
} = require('../../Middlewares/middleware')

const router = require('express').Router()

router
  .post('/add', requireSignin, userMiddleware, addOrder)
  .get('/get', requireSignin, userMiddleware, getOrders)
  .post('/getorder', requireSignin, userMiddleware, getOrder)

module.exports = router
