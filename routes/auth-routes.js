const express = require ('express')
const router = express.Router()
const authController = require('../controllers/auth-controller')

router.post('/register',authController.register)
router.post('/login',authController.login)
// router.get('/me',authenticate,authController.getme)
router.get('/users',authController.getUsers)
router.put('/update/:id',authController.updateUser)
router.delete('/delete/user/:id', authController.deleteUser);

module.exports = router