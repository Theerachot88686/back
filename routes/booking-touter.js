const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking-controller');
const multer = require('multer');
const path = require('path');

// ตั้งค่า storage สำหรับ multer (ตรวจสอบให้มีโฟลเดอร์ 'uploads' อยู่ในโปรเจค)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ระบุโฟลเดอร์สำหรับเก็บไฟล์อัปโหลด
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // สร้างชื่อไฟล์ที่ไม่ซ้ำ
  }
});
const upload = multer({ storage: storage });

// เส้นทางต่าง ๆ
router.get('/', bookingController.getAllBooking);
router.get('/bookings/:id/id', bookingController.getBookingsByID);
router.get('/bookings/all', bookingController.getAllBookings);
router.post('/bookings/create/:id', upload.single('slip'), bookingController.createBooking);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);
router.get('/export', bookingController.exportBookings);

// เส้นทางสำหรับอัปเดตสถานะการจองและการชำระเงิน
router.put('/bookings/:id/cancel', bookingController.cancelBooking);
router.put('/bookings/:id/confirm', bookingController.confirmBooking);
router.put('/bookings/:id/complete', bookingController.completeBooking);

router.get('/bookings/current/:userId', bookingController.getCurrentBookingsID);
router.get('/bookings/historys/:userId', bookingController.getHistoryBookingsID);

// routes/booking.js
router.get('/bookings/current', bookingController.getCurrentBookings);
router.get('/bookings/history', bookingController.getHistoryBookings);

router.get('/bookings/pending', bookingController.getPendingBookings);

router.get('/export', bookingController.exportBookings);
module.exports = router;
