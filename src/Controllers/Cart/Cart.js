const Cart = require('../../Models/Cart')

function updateItemsAddedToCart (condition, updatedData) {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, updatedData, { upsert: true })
      .then(result => resolve())
      .catch(error => reject(error))
  })
}

exports.addItemsToCart = (req, res) => {
  //if CART EXISTS UPDATE CART

  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error)
      res.status(400).json({ error, message: 'Error from add item to cart' })
    if (cart) {
      let promiseArray = []
      req.body.cartItems.forEach(cartItem => {
        const product = cartItem.product
        const item = cart.cartItems.find(c => c.product === product)
        let condition, update
        if (item) {
          condition = {
            user: req.user._id,
            'cartItems.product': (update = {
              $set: {
                'cartItems.$': cartItem
              }
            })
          }
        } else {
          condition = { user: req.user._id }
          update = {
            $push: {
              cartItems: cartItem
            }
          }
        }

        promiseArray.push(updateItemsAddedToCart(condition, update))
      })
      Promise.all(promiseArray)
        .then(response => res.status(201).json({ response }))
        .catch(error => res.status(400).json({ error }))
    } else {
      //IF CART DOES NOT EXIST, CREATE A NEW CART
      const newCart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems
      })
      newCart.save((error, cart) => {
        if (error) res.status(400).json({ error })
        if (cart) res.status(200).json({ cart })
      })
    }
  })
}

exports.getCartItems = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .populate('cartItems.product', '_id name price productPictures')
    .exec((error, cart) => {
      if (error) res.status(400).json({ error })
      if (cart) {
        let cartItems = {}
        cart.cartItems.forEach((item, index) => {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.product.name,
            cartImage: item.product.productPictures[0].images,
            price: item.product.price,
            quantity: item.quantity
          }
        })

        res.status(200).json({ cartItems })
      }
    })
}

exports.removeCartItems = (req, res) => {
  const { productId } = req.body.payload
  if (productId) {
    try {
      Cart.updateOne(
        { user: req.user._id },
        {
          $pull: {
            cartItems: {
              product: productId
            }
          }
        }
      ).exec((error, result) => {
        error && res.status(400).json({ cartItems })
        result && res.status(200).json({ result })
      })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
}
