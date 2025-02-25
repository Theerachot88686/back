const express = require('express');
const multer = require('multer');
const carouselController = require('../controllers/carousel-controller');

const router = express.Router();

// ใช้ memoryStorage เพราะอัปโหลดไป ImgBB ไม่ต้องเก็บไฟล์ไว้ที่เซิร์ฟเวอร์
const upload = multer({ storage: multer.memoryStorage() });

// Route สำหรับเพิ่มรูปภาพ
router.post('/carousel', upload.single('image'), carouselController.createImage);

// Route สำหรับดึงข้อมูลรูปภาพทั้งหมด
router.get('/carousel', carouselController.getImages);

// Route สำหรับลบรูปภาพ
router.delete('/carousel/:id', carouselController.deleteImage);

// Route สำหรับแก้ไขข้อมูลรูปภาพ
router.put('/carousel/:id', upload.single('image'), carouselController.updateImage);

module.exports = router;