const express = require ('express')
const router = express.Router()
const authController = require('../controllers/auth-controller')

// เส้นทางสำหรับลงทะเบียนผู้ใช้ใหม่
router.post('/register',authController.register)

// เส้นทางสำหรับเข้าสู่ระบบ
router.post('/login',authController.login)

// เส้นทางสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/users',authController.getUsers)

// เส้นทางสำหรับอัปเดตข้อมูลผู้ใช้ตาม ID
router.put('/update/:id',authController.updateUser)

// เส้นทางสำหรับลบผู้ใช้ตาม ID
router.delete('/delete/user/:id', authController.deleteUser)

module.exports = router
