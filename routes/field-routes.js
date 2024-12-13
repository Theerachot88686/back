const express = require('express')
const router = express.Router()
const fieldController = require('../controllers/field-controller')

// ดึงข้อมูลฟิลด์ทั้งหมด
router.get('/', fieldController.getFields);  // ตรวจสอบว่าใช้ controller function ถูกต้อง

// เพิ่มข้อมูลฟิลด์
router.post('/', fieldController.createField);

// แก้ไขข้อมูลฟิลด์
router.put('/:id', fieldController.updateField);

// ลบข้อมูลฟิลด์
router.delete('/:id', fieldController.deleteField);


module.exports = router

