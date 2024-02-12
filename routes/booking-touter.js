// routes/routes.js
const express = require('express');
const router = express.Router();
const authenticate = require("../middlewares/authenticate"); // import middleware ที่รับผิดชอบในการเพิ่มข้อมูล user ลงใน req
const bookingController = require('../controllers/booking-controller');
const decodedToken = require('../middlewares/dEcodeJWT')
// GET all bookings
router.get('/bookings',authenticate,bookingController.getAllBookings);

// CREATE a new booking
router.post('/bookings',authenticate,bookingController.createBooking);

// UPDATE a booking
router.put('/bookings/:id',authenticate,bookingController.updateBooking);

// DELETE a booking
router.delete('/bookings/:id', authenticate,bookingController.deleteBooking);

router.get("/user-bookings", bookingController.getUserBookings);


module.exports = router;

