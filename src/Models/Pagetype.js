const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PageTypeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    bannerImages: [
      {
        images: {
          type: String
        },
        navigateTo: { type: String }
      }
    ],

    productImages: [
      {
        images: {
          type: String
        },
        navigateTo: { type: String }
      }
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      unique: true
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Pagetype', PageTypeSchema)
