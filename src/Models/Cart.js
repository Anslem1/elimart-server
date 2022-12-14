const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, default: 1, required: true },
        price: { type: Number }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cart', cartSchema)
