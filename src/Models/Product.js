const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      min: 3,
      max: 20
    },
    price: {
      type: Number,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    offers: { type: Number },
    productPictures: [
      {
        images: {
          type: String
        }
      }
    ],
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required:true
      //   review: String
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Product', productSchema)
