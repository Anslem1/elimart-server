const bcrypt = require('bcrypt')
const User = require('../../../Models/User')
const jwt = require('jsonwebtoken')

exports.signUp = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
      const username = await User.findOne({
        username: req.body.username
      })
      if (user || username) {
        res.status(400).json({ message: 'Email or username already exists' })
      } else if (!user && !username) {
        const { firstName, lastName, email } = req.body
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          fullName: firstName + ' ' + lastName,
          username: req.body.username
            ? req.body.username
            : Math.random().toString(),
          role: 'admin'
        })
        newUser.save((error, user) => {
          if (error) res.status(500).json({ error })

          if (user) {
            const token = jwt.sign(
              { _id: user._id, role: user.role },
              process.env.JWT_SECRET,
              {
                expiresIn: '30d'
              }
            )
            const { password, ...userCreds } = user._doc
            res.status(200).json({
              token,
              user: userCreds,
              message: 'User successfully create'
            })
          }
        })
      } else if (error) {
        res.status(400).json({ error })
        console.log({ error })
      }
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.signIn = async (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    try {
      const validated = await bcrypt.compare(req.body.password, user.password)
      if (error) res.status(400).json({ error: 'Something went wrong' })
      if (user && validated && user.role === 'admin') {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: '30d'
          }
        )
        res.cookie('token', token, { expiresIn: '30d' })
        const { password, ...userCreds } = user._doc
        res.status(200).json({ token, user: userCreds })
      } else
        return res.status(400).json({ message: 'Wrong username or password' })
    } catch (error) {
      return res.status(500).json({ error, message: "Couldn't find user" })
    }
  })
}

exports.signOut = async (req, res) => {
  const cookie = res.clearCookie('token')
  res.status(200).json({
    message: 'You have signed out successfully'
  })
}
