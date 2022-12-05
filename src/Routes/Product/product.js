const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts
} = require('../../Controllers/Products/Products')

const {
  requireSignin,
  adminMiddleware,
  upload
} = require('../../Middlewares/middleware')

const router = require('express').Router()

router
  .post(
    '/product/create',
    requireSignin,
    adminMiddleware,
    upload.array('productPicture', 4),
    createProduct
  )
  .get('/products/:slug', getProductsBySlug)
  .get('/product/:productId', getProductDetailsById)
  .delete('/product/delete', requireSignin, adminMiddleware, deleteProductById)
  .post('/product/get', requireSignin, adminMiddleware, getProducts)

module.exports = router
