// controllers/bookingController.js
const getUserIdFromJWT = require("../helpers/decodeJWT");
const db = require("../models/db");

exports.getAllBooking = async (req, res) => {
  try {
    // ดึงข้อมูลการจองทั้งหมด รวมถึงข้อมูล Field และ User โดยเรียงจากล่าสุดไปเก่าสุด
    const bookings = await db.Booking.findMany({
      include: { 
        field: true, // ใช้ตัวพิมพ์เล็ก
        user: true   // ใช้ตัวพิมพ์เล็ก
      },
      orderBy: {
        id: 'desc' // เรียงตาม dueDate แบบลดลำดับ (จากใหม่ไปเก่า)
      }
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


exports.getBookingsByID = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("User ID not found");
    }

    // Fetch bookings only for the logged-in user
    const bookings = await db.Booking.findMany({
      where: { userId: Number(id) },
      orderBy: {
        id: 'desc' // เรียงตาม dueDate แบบลดลำดับ (จากใหม่ไปเก่า)
      }
    });
 
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getAllBookings = async (req, res) => {
  try {

    // Fetch bookings only for the logged-in user
    const bookings = await db.Booking.findMany({
      orderBy: {
        id: 'desc' // เรียงตาม dueDate แบบลดลำดับ (จากใหม่ไปเก่า)
      }
    });
 
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.createBooking = async (req, res, next) => {
  const data = req.body;
  const { id } = req.params;
  console.log(data);

  try {
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

    // Proceed to create a new booking
    let bookingData = { ...data };

    // If userId is missing, use the id from the params
    if (!data.userId && id) {
      bookingData.userId = Number(id);
    }

    const newBooking = await db.Booking.create({
      data: bookingData,
    });

    return res.json({ msg: 'Create OK', result: newBooking });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



exports.updateBooking = async (req, res, next) => {
  const data = req.body;
  const bookingId = parseInt(req.params.id);  // Assuming booking ID is passed in the URL
  try {
    
    // Check if the booking exists
    const existingBooking = await db.Booking.findUnique({
      where: { id: bookingId }
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Update the booking
    const updatedBooking = await db.Booking.update({
      where: { id: bookingId },
      data: {
        ...data,
      }
    });

    res.json({ msg: 'Booking updated successfully', result: updatedBooking });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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


