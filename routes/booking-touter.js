// routes/routes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking-controller');

router.get('/',bookingController.getAllBooking);

// GET By Id bookings
router.get('/bookings/:id/id',bookingController.getBookingsByID);

router.get('/bookings/all',bookingController.getAllBookings);

// CREATE a new booking
router.post('/bookings/create/:id',bookingController.createBooking);

// UPDATE a booking
router.put('/bookings/:id',bookingController.updateBooking);

// DELETE a booking
router.delete('/bookings/:id',bookingController.deleteBooking);

// router.get("/user-bookings", bookingController.getUserBookings);


module.exports = router;

