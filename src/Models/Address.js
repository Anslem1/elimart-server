const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, min: 3, max: 50 },
    mobileNumber: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    alternatePhoneNumber: {
      type: String
    },
    addressType: {
      type: String,
      required: true,
      enum: ['home', 'work']
    }
  }
)

const userAddressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    address: [addressSchema]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('userAddress', userAddressSchema)
