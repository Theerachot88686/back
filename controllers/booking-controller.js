const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');
const db = new PrismaClient();
const { Parser } = require('json2csv');



// ฟังก์ชันสำหรับดึงข้อมูลการจองทั้งหมด
exports.getAllBooking = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        field: true,
        user: true,
        Payment: true,
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงการจองโดย ID
exports.getBookingsByID = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        field: true,
        user: true,
        Payment: true,
      },
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงการจองทั้งหมด
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ['Pending', 'Confirm', 'Completed'] // รับเฉพาะสถานะเหล่านี้
        }
      },
      include: {
        field: true,
        user: true,
        Payment: true,
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// สร้างการจองใหม่
exports.createBooking = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { startTime, endTime, dueDate, totalCost, fieldId } = req.body;
  let slipPath = null;
  if (req.file) {
    slipPath = req.file.path;
  }
  try {
    const booking = await prisma.booking.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        dueDate: new Date(dueDate),
        totalCost: parseFloat(totalCost),
        userId: userId,
        fieldId: parseInt(fieldId),
        // status จะถูกตั้งค่าเริ่มต้นเป็น Pending โดยอัตโนมัติ
      },
      include: {
        field: true,
        user: true,
        Payment: true,
      },
    });
    // ถ้ามีการอัปโหลด slip ให้สร้าง record ใน Payment
    if (slipPath) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          slip: slipPath,
          // paymentStatus จะถูกตั้งค่าเริ่มต้นเป็น Pending
        },
      });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// อัปเดตข้อมูลการจอง
exports.updateBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  const { startTime, endTime, dueDate, totalCost, fieldId } = req.body;
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        dueDate: new Date(dueDate),
        totalCost: parseFloat(totalCost),
        fieldId: parseInt(fieldId),
      },
      include: {
        field: true,
        user: true,
        Payment: true,
      },
    });
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ลบการจอง
exports.deleteBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  try {
    await prisma.booking.delete({
      where: { id: bookingId },
    });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ส่งออกข้อมูลการจอง (export)
exports.exportBookings = async (req, res) => {
  const { month, year } = req.query; // รับเดือนและปีจาก query string

  try {
    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required." });
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // ดึงข้อมูลการจองพร้อมราคาฟิลด์ที่เลือก
    const bookings = await db.Booking.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        field: true,
        user: true,
      },
      orderBy: { id: "asc" }, // เรียงตาม bookingId จากน้อยไปมาก
    });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this month." });
    }

    // คำนวณราคารวมสำหรับการจองทั้งหมดในเดือนนี้
    let totalPrice = 0;
    const formattedBookings = bookings.map((booking) => {
      const fieldPricePerHour = booking.field ? booking.field.pricePerHour : 0; // ราคาแต่ละสนามต่อชั่วโมง
    
      // คำนวณเวลาระหว่าง startTime และ endTime
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
    
      // กำหนดตัวเลือกในการแสดงเวลาเป็นชั่วโมงและนาที
      const options = { hour: '2-digit', minute: '2-digit' };
      
      // คำนวณผลต่างของเวลาเป็นชั่วโมง
      const timeDifferenceInMilliseconds = endTime - startTime;
      const hours = timeDifferenceInMilliseconds / (1000 * 60 * 60); // เปลี่ยนจากมิลลิวินาทีเป็นชั่วโมง
    
      // คำนวณราคาโดยการคูณเวลาที่ใช้กับราคาต่อชั่วโมงของสนาม
      const bookingPrice = hours * fieldPricePerHour;
    
      totalPrice += bookingPrice; // คำนวณราคารวม
    
      return {
        bookingId: booking.id,
        fieldName: booking.field ? booking.field.name : "Unknown",
        bookingDate: booking.dueDate
          ? new Date(booking.dueDate).toLocaleDateString()
          : "Unknown",
        startTime: startTime.toLocaleTimeString([], options),  // แสดงเวลาแค่ชั่วโมงและนาที
        endTime: endTime.toLocaleTimeString([], options),      // แสดงเวลาแค่ชั่วโมงและนาที
        hours: hours.toFixed(2), // จำนวนชั่วโมง
        price: bookingPrice.toFixed(2), // เพิ่มราคาแต่ละการจอง
      };
    });

    // เพิ่มข้อมูลราคารวมในแถวสุดท้าย
    const finalData = [...formattedBookings, { price: totalPrice.toFixed(2) }];

    // แปลงข้อมูลเป็น CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(finalData);

    // ตั้งค่า header เพื่อให้เบราว์เซอร์รู้ว่าจะต้องดาวน์โหลดเป็นไฟล์ CSV
    res.header("Content-Type", "text/csv");
    res.attachment(`bookings-${month}-${year}.csv`);
    return res.send(csv); // ส่งไฟล์ CSV กลับไป
  } catch (err) {
    console.error("Error exporting bookings:", err);
    res.status(500).send("Server Error");
  }
};
// =================== ฟังก์ชันใหม่สำหรับอัปเดตสถานะ ===================

// 1. ยกเลิกการจอง (Cancel) - อัปเดตทั้ง Booking และ Payment เป็น Cancel
exports.cancelBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { Payment: true },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "Cancel" },
      include: { field: true, user: true, Payment: true },
    });
    if (booking.Payment) {
      await prisma.payment.update({
        where: { bookingId: bookingId },
        data: { paymentStatus: "Cancel" },
      });
    }
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. ยืนยันการจอง (Confirm) - อัปเดตทั้ง Booking และ Payment เป็น Confirm
exports.confirmBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { Payment: true },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "Confirm" },
      include: { field: true, user: true, Payment: true },
    });
    if (booking.Payment) {
      await prisma.payment.update({
        where: { bookingId: bookingId },
        data: { paymentStatus: "Confirm" },
      });
    }
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. ทำเครื่องหมายการจองสำเร็จ (Complete) - อัปเดต Booking เป็น Completed (Payment ไม่เปลี่ยนแปลง)
exports.completeBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "Completed" },
      include: { field: true, user: true, Payment: true },
    });
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงการจองปัจจุบัน (Pending, Confirm)
exports.getCurrentBookingsID = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
        status: {
          in: ['Pending', 'Confirm']
        }
      },
      include: {
        field: true,
        user: true,
        Payment: true
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงประวัติการจอง (Completed, Cancel)
exports.getHistoryBookingsID = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
        status: {
          in: ['Completed', 'Cancel']
        }
      },
      include: {
        field: true,
        user: true,
        Payment: true
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงการจองปัจจุบัน (Pending, Confirm)
exports.getCurrentBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ['Pending', 'Confirm']
        }
      },
      include: {
        field: true,
        user: true,
        Payment: true
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงประวัติการจอง (Completed, Cancel)
exports.getHistoryBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ['Completed', 'Cancel']
        }
      },
      include: {
        field: true,
        user: true,
        Payment: true
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingBookings = async (req, res) => {
  try {
    const pendingBookings = await prisma.booking.findMany({
      where: {
        status: 'Pending',
      },
      include: {
        field: true,
        user: true,
        Payment: true,
      },
    });
    res.json(pendingBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

