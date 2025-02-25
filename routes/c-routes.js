const express = require('express');
const router = express.Router();
const carouselController = require('../controllers/carousel-controller');
const multer = require('multer');

// การตั้งค่าการอัปโหลดไฟล์
const upload = multer({ dest: 'uploads/' });

router.get('/carousels', carouselController.getCarousels);
router.post('/carousels', upload.single('image'), carouselController.createCarousel);
router.put('/carousels/:id', upload.single('image'), carouselController.updateCarousel);
router.delete('/carousels/:id', carouselController.deleteCarousel);

module.exports = router;
