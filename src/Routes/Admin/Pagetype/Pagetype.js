const {
  createPageType,
  getpageTypes
} = require('../../../Controllers/Admin/PageType/PageType')
const {
  adminMiddleware,
  requireSignin,
  upload
} = require('../../../Middlewares/middleware')

const router = require('express').Router()

router
  .post(
    '/create',
    requireSignin,
    adminMiddleware,
    upload.fields([{ name: 'bannerImages' }, { name: 'productImages' }]),
    createPageType
  )
  .get('/:category/:pagetype', getpageTypes)

module.exports = router
