const { getAddress, addAddress } = require('../../Controllers/Address/Address')
const {
  requireSignin,
  userMiddleware
} = require('../../Middlewares/middleware')

const router = require('express').Router()

router
  .get('/get', requireSignin, userMiddleware, getAddress)
  .post('/create', requireSignin, userMiddleware, addAddress)

module.exports = router
