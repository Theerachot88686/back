const express = require('express');
const router = express.Router();
const carouselController = require('../controllers/carousel-controller');
const multer = require('multer');

// ใช้ memoryStorage เพราะอัปโหลดไป ImgBB ไม่ต้องเก็บไฟล์ไว้ที่เซิร์ฟเวอร์
const upload = multer({ storage: multer.memoryStorage() });

router.get('/carousels', carouselController.getCarousels);
router.post('/carousels', upload.single('image'), carouselController.createCarousel);
router.put('/carousels/:id', upload.single('image'), carouselController.updateCarousel);
router.delete('/carousels/:id', carouselController.deleteCarousel);

module.exports = router;
