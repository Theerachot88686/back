const express = require('express')
const router = express.Router()
const pullController = require('../controllers/pull-controller')

router.get('/pull', pullController.getUsersWithRole)

module.exports = router