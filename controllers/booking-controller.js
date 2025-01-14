const getUserIdFromJWT = require("../helpers/decodeJWT");
const db = require("../models/db");
// นำเข้าโมดูลสำหรับถอดรหัส JWT และฐานข้อมูล

exports.getAllBooking = async (req, res) => {
  // ฟังก์ชันสำหรับดึงข้อมูลการจองทั้งหมด
  try {
    const bookings = await db.Booking.findMany({
      include: { 
        field: true, // ดึงข้อมูลสนาม
        user: true   // ดึงข้อมูลผู้ใช้
      },
      orderBy: { id: 'desc' } // เรียงลำดับจากใหม่ไปเก่า
    });

    res.json(bookings); // ส่งข้อมูลการจองทั้งหมดกลับไป
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error"); // ส่งข้อความแสดงข้อผิดพลาดกรณีเซิร์ฟเวอร์มีปัญหา
  }
};

exports.getBookingsByID = async (req, res) => {
  // ฟังก์ชันสำหรับดึงข้อมูลการจองเฉพาะผู้ใช้ตาม `userId`
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("User ID not found"); // ตรวจสอบว่ามี `id` หรือไม่
    }

    const bookings = await db.Booking.findMany({
      where: { userId: Number(id) }, // เงื่อนไขการค้นหาตาม `userId`
      orderBy: { id: 'desc' } // เรียงลำดับจากใหม่ไปเก่า
    });
 
    res.json(bookings); // ส่งข้อมูลการจองของผู้ใช้กลับไป
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getAllBookings = async (req, res) => {
  // ฟังก์ชันสำหรับดึงข้อมูลการจองทั้งหมด (คล้ายกับ `getAllBooking` ด้านบน)
  try {
    const bookings = await db.Booking.findMany({
      orderBy: { id: 'desc' } // เรียงลำดับจากใหม่ไปเก่า
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.createBooking = async (req, res, next) => {
  // ฟังก์ชันสำหรับสร้างการจองใหม่
  const data = req.body; // ข้อมูลการจองที่ผู้ใช้ส่งมา
  const { id } = req.params;

  try {
    // ตรวจสอบว่ามีการจองซ้ำกันในวันและเวลานั้นหรือไม่
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
      // ส่งข้อความแจ้งข้อผิดพลาดหากมีการจองซ้ำ
    }

    let bookingData = { ...data };
    if (!data.userId && id) {
      bookingData.userId = Number(id); // ใช้ `id` จากพารามิเตอร์หาก `userId` ไม่มีค่า
    }

    const newBooking = await db.Booking.create({
      data: bookingData, // บันทึกการจองใหม่ลงฐานข้อมูล
    });

    return res.json({ msg: 'Create OK', result: newBooking }); // ส่งข้อความยืนยันการสร้างสำเร็จ
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateBooking = async (req, res, next) => {
  // ฟังก์ชันสำหรับอัปเดตข้อมูลการจอง
  const data = req.body;
  const bookingId = parseInt(req.params.id); // รับ `bookingId` จากพารามิเตอร์

  try {
    const existingBooking = await db.Booking.findUnique({
      where: { id: bookingId } // ตรวจสอบว่าการจองมีอยู่จริง
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found.' });
      // ส่งข้อความแจ้งข้อผิดพลาดหากไม่พบการจอง
    }

    const updatedBooking = await db.Booking.update({
      where: { id: bookingId }, // อัปเดตข้อมูลการจอง
      data: { ...data }
    });

    res.json({ msg: 'Booking updated successfully', result: updatedBooking });
    // ส่งข้อความยืนยันการอัปเดตสำเร็จ
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  // ฟังก์ชันสำหรับลบข้อมูลการจอง
  const { id } = req.params;

  try {
    await db.Booking.delete({
      where: { id: parseInt(id) } // ลบการจองตาม `id`
    });

    res.json({ message: "Booking deleted" }); // ส่งข้อความยืนยันการลบสำเร็จ
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
