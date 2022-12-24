const Product = require('../../Models/Product')
const slugify = require('slugify')
const Category = require('../../Models/Category')

exports.createProduct = (req, res) => {
  //   res.status(200).json({ file: req.files, body: req.body })
  const { name, description, price, category, quantity } = req.body
  let productPictures = []

  if (req.files.length > 0) {
    productPictures = req.files.map(file => {
      return { images: file.path }
    })
  }

 
  const product = new Product({
    name,
    slug: slugify(name),
    description,
    price,
    productPictures,
    category,
    quantity,
    createdBy: req.user._id
  })

  product.save((error, product) => {
    if (error) res.status(400).json({ error })
    if (product) res.status(200).json({ product })
  })
}

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params
  Category.findOne({ slug })
    .select('_id pagetype')
    .exec((error, category) => {
      if (error) res.status(400).json({ error })
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) res.status(400).json({ error })
          if (category.pagetype) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under30k: 30000,
                  under60k: 60000,
                  under80k: 80000,
                  under100k: 100000,
                  under120k: 120000,
                  above120k: 120000
                },
                productsByPrice: {
                  under30k: products.filter(product => product.price <= 30000),
                  under60k: products.filter(
                    product => product.price > 30000 && product.price <= 50000
                  ),
                  under80k: products.filter(
                    product => product.price > 50000 && product.price <= 80000
                  ),
                  under100k: products.filter(
                    product => product.price > 80000 && product.price <= 100000
                  ),
                  under120k: products.filter(
                    product => product.price > 100000 && product.price <= 120000
                  ),
                  above120k: products.filter(product => product.price > 120000)
                }
              })
            }
          } else res.status(200).json({ products })
        })
      }
    })
  // return res.status(200).json({ slug })
}

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params
  try {
    if (productId) {
      Product.findOne({ _id: productId }).exec((error, product) => {
        if (error) res.status(400).json({ error })
        if (product) {
          res.status(200).json({ product })
        } else res.status(403).json({ error: 'Params required' })
      })
    }
  } catch (error) {
    return res.statusz(500).json({ error })
  }
}
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload
  try {
    if (productId) {
      Product.deleteOne({ _id: productId }).exec((error, result) => {
        error && res.status(400).json({ error })
        result && res.status(200).json({ result })
      })
    } else {
      return res.statusz(401).json({ error: 'parameter needed' })
    }
  } catch (error) {
    return res.statusz(500).json({ error })
  }
}

exports.getProducts = async (req, res) => {
  const products = await Product.find({})
    .select('_id name price quantity slug description productPictures category')
    .populate({ path: 'category', select: '_id name' })
    .exec()
  res.status(200).json({ products })
}
