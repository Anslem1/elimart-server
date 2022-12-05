const Pagetype = require('../../../Models/Pagetype')

exports.createPageType = (req, res) => {
  const { bannerImages, productImages } = req.files

  if (bannerImages.length > 0) {
    req.body.bannerImages = bannerImages.map((bannerImage, index) => ({
      images: `${process.env.API}/public/${bannerImage.filename}`,
      navigateTo: `/bannerImageClicked?categoryId=${req.body.category}&pagetype=${req.body.pagetype}`
    }))
  }
  if (productImages.length > 0) {
    req.body.productImages = productImages.map((productImage, index) => ({
      images: `${process.env.API}/public/${productImage.filename}`,
      navigateTo: `/productImageClicked?categoryId=${req.body.category}&pagetype=${req.body.pagetype}`
    }))
  }

  req.body.createdBy = req.user._id

  Pagetype.findOne({ category: req.body.category }).exec((error, page) => {
    if (error) res.status(400).json({ error })
    if (page) {
      Pagetype.findOneAndUpdate({ category: req.body.category }, req.body, {
        new: true
      }).exec((error, updatedPageRype) => {
        if (error) return res.status(400).json({ error })
        if (updatedPageRype)
          return res.status(200).json({ pagetype: updatedPageRype })
      })
    } else {
      const pageType = new Pagetype(req.body)
      pageType.save((error, pagetype) => {
        if (error) res.status(400).json({ error })
        if (pagetype) return res.status(200).json({ pagetype })
      })
    }
  })
}

exports.getpageTypes = (req, res) => {
  const { category, pagetype } = req.params
  if (pagetype === 'Page') {
    Pagetype.findOne({ category }).exec((error, pagetype) => {
      if (error) return res.status(400).json({ error })
      if (pagetype) return res.status(200).json({ pagetype })
    })
  }
}
