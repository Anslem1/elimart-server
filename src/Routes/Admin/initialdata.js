const { initialData } = require('../../Controllers/Admin/Initaldata');

const router = require('express').Router()

router.get('/initialdata', initialData)

module.exports = router
