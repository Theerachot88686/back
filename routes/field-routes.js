const express = require('express')
const router = express.Router()
const fieldController = require('../controllers/field-controller')

router.get('/getfield',fieldController.getByUser)

module.exports = router