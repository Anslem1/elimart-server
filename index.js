require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const adminRoutes = require('./src/Routes/Auth/Admin/admin.auth')
const userRoutes = require('./src/Routes/Auth/User/user.auth')
const categoryRoutes = require('./src/Routes/Category/category')
const productRoutes = require('./src/Routes/Product/product')
const cartRoutes = require('./src/Routes/Cart/cart')
const pageTypeRoute = require('./src/Routes/Admin/Pagetype/Pagetype')
const initialDataRoutes = require('./src/Routes/Admin/initialdata')
const adminOrderRoute = require('./src/Routes/Admin/Order/AdminOrders')
const addressRoutes = require('./src/Routes/Address/address')
const orderRoutes = require('./src/Routes/Order/order')

const app = express()

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log('Mongo working?'))
  .catch(err => console.log({ err }))

app
  .use(cors())
  .use(express.json())
  .use('/api/auth/admin', adminRoutes)
  .use('/api/auth', userRoutes)
  .use('/api/categories', categoryRoutes)
  .use('/api', productRoutes)
  .use('/api/user/cart', cartRoutes)
  .use('/api/pagetype', pageTypeRoute)
  .use('/api', initialDataRoutes)
  .use('/api/user/address', addressRoutes)
  .use('/api/user/orders', orderRoutes)
  .use('/api/admin/orders', adminOrderRoute)

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`) 
})
