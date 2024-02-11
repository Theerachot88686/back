// controllers/bookingController.js
const getUserIdFromJWT = require('../helpers/decodeJWT');
const db = require('../models/db');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await db.Booking.findMany();
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.createBooking = async (req, res, next) => {
  const data = req.body;
  const token = req.headers.authorization
  const userId = getUserIdFromJWT(token);
  console.log(data)
  try {
    if (!userId) {
      throw new Error('User data is missing or incomplete');
    }

    const rs = await db.Booking.create({
      data: {
        ...data,
        userId: userId
    }
    });
    res.json({ msg: 'Create OK', result: rs }); 
  } catch (err) {
    next(err); 
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await db.Booking.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Booking.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
