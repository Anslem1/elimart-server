const Category = require('../../Models/Category')
const slugify = require('slugify')
const shortid = require('shortid')

function addCategories (categories, parentId = null) {
  const categoryList = []
  let category
  if (parentId === null) {
    category = categories.filter(cate => cate.parentId == undefined)
  } else {
    category = categories.filter(cate => cate.parentId == parentId)
  }
  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      categoryImage: cate.categoryImage,
      parentId: cate.parentId,
      pagetype: cate.pagetype,
      children: addCategories(categories, cate._id)
    })
  }
  return categoryList
}

exports.createCategories = async (req, res) => {
  const categoryObject = {
    name: req.body.name,
    slug: slugify(req.body.name),
    pagetype: req.body.pagetype
  }

  let categoryImageUrl
  if (req.file) {
    categoryImageUrl = req.file.path
    categoryObject.categoryImage = categoryImageUrl
  }

  if (req.body.parentId) {
    categoryObject.parentId = req.body.parentId
  }
  const cate = new Category(categoryObject)

  Category.findOne({
    slug: categoryObject.name
  }).exec((error, slug) => {
    error && res.status(400).json({ error })
    if (slug) {
      res.status(400).json({ message: 'Category already exists' })
    } else {
      cate.save((error, category) => {
        if (error) res.status(400).json({ error })
        if (category) res.status(200).json({ category })
      })
    }
  })
}

exports.getAllCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) res.status(400).json({ error })
    if (categories) {
      const categoryList = addCategories(categories)
      res.status(200).json({ categoryList })
    }
  })
}

exports.updateCategories = async (req, res) => {
  try {
    const { _id, name, parentId, pagetype } = req.body

    const updatedCategories = []
    if (name instanceof Array) {
      for (i = 0; i < name.length; i++) {
        const category = {
          name: name[i],
          pagetype: pagetype[i]
        }
        if (parentId[i] !== '') {
          category.parentId = parentId[i]
        }
        const updatedCategory = await Category.findOneAndUpdate(
          { _id: _id[i] },
          category,
          { new: true }
        )
        updatedCategories.push(updatedCategory)
      }
      return res.status(200).json({ updatedCategories })
    } else {
      const category = {
        name,
        pagetype
      }
      if (parentId !== '') {
        category.parentId = parentId
      }
      const updatedCategory = await Category.findOneAndUpdate(
        { _id },
        category,
        {
          new: true
        }
      )
      return res.status(200).json({ updatedCategory })
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload

  const deletedCategories = []
  for (let i = 0; i < ids.length; i++) {
    let deleteCategory
    try {
      deleteCategory = await Category.findByIdAndDelete({ _id: ids[i]._id })
      deletedCategories.push(deleteCategory)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
  if (deletedCategories.length == ids.length) {
    res.status(200).json({ message: 'Categories deleted' })
  } else res.status(200).json({ message: 'Something went wrong' })
  // return res.status(200).json({ body: req.body })
}
