const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true },
    pagetype: { type: String },
    categoryImage: { type: String },
    parentId: { type: String }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Category', categorySchema)
