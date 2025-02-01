const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking-controller');

// เส้นทางสำหรับดึงข้อมูลการจองทั้งหมด
router.get('/', bookingController.getAllBooking);

// เส้นทางสำหรับดึงข้อมูลการจองของผู้ใช้ตาม ID
router.get('/bookings/:id/id', bookingController.getBookingsByID);

// เส้นทางสำหรับดึงข้อมูลการจองทั้งหมด (ไม่จำกัดผู้ใช้)
router.get('/bookings/all', bookingController.getAllBookings);

// เส้นทางสำหรับสร้างการจองใหม่
router.post('/bookings/create/:id', bookingController.createBooking);

// เส้นทางสำหรับอัปเดตการจองตาม ID
router.put('/bookings/:id', bookingController.updateBooking);

// เส้นทางสำหรับลบการจองตาม ID
router.delete('/bookings/:id', bookingController.deleteBooking);

// เส้นทางสำหรับ export ข้อมูลการจองตามเดือน
router.get('/export', bookingController.exportBookings);

module.exports = router;
