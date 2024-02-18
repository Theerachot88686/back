// controllers/bookingController.js
const getUserIdFromJWT = require("../helpers/decodeJWT");
const db = require("../models/db");


exports.getAllBookings = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = getUserIdFromJWT(token); // Get the user's ID from the JWT token
    if (!userId) {
      throw new Error("User ID not found");
    }

    // Fetch bookings only for the logged-in user
    const bookings = await db.Booking.findMany({
      where: { userId: userId },
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.createBooking = async (req, res, next) => {
  const data = req.body;
  const token = req.headers.authorization;
  const userId = getUserIdFromJWT(token);
  console.log(data);
  try {
    if (!userId) {
      throw new Error('User data is missing or incomplete');
    }

    // Check if there's an existing booking with the same date and time
    const existingBooking = await db.Booking.findMany({
      where: {
        AND: [
          { dueDate: data.dueDate },
          { startTime: data.startTime },
          { endTime: data.endTime }
        ]
      }
    });

    if (existingBooking.length > 0) {
      return res.status(400).json({ error: 'Booking already exists for this date and time.' });
    }

    const rs = await db.Booking.create({
      data: {
        ...data,
        userId: userId
      }
    });
    res.json({ msg: 'Create OK', result: rs }); 
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await db.Booking.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Booking.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = getUserIdFromJWT(token);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userBookings = await db.Booking.findMany({
      where: { userId: parseInt(userId) },
      include: { Field: true }, // Include the associated Field data
    });

    res.json(userBookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
