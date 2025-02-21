const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require("dayjs");
const db = new PrismaClient();
const { Parser } = require("json2csv");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const { uploadToImgBB } = require("./imgbbUploader");
const multer = require("multer");

const sendEmail = async (recipient, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "taikung3133@gmail.com", // เปลี่ยนเป็นอีเมล Gmail ของคุณ
      pass: "cqgz hczx yayd wolu", // ใช้ App Password แทนรหัสผ่านปกติ
    },
  });

  const mailOptions = {
    from: "your_email@gmail.com", // อีเมลผู้ส่ง
    to: recipient, // อีเมลผู้รับ
    subject: subject, // หัวข้อของอีเมล
    html: htmlContent, // เนื้อหาของอีเมลในรูปแบบ HTML
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

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
          in: ["Pending", "Confirm", "Completed"], // รับเฉพาะสถานะเหล่านี้
        },
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
  let slipUrl = null;

  try {
    // ตรวจสอบว่ามีไฟล์ slip อัปโหลดมาหรือไม่
    if (req.file) {
      slipUrl = await uploadToImgBB(req.file.path); // อัปโหลดไป ImgBB
    }

    const booking = await prisma.booking.create({
      data: {
        startTime: moment.tz(startTime, "Asia/Bangkok").toDate(),
        endTime: moment.tz(endTime, "Asia/Bangkok").toDate(),
        dueDate: moment.tz(dueDate, "Asia/Bangkok").toDate(),
        totalCost: parseFloat(totalCost),
        userId: userId,
        fieldId: parseInt(fieldId),
      },
      include: {
        field: true,
        user: true,
        Payment: true,
      },
    });

    // ส่งอีเมลยืนยันการจองไปยังผู้ใช้
    const customerEmailContent = `
    <h2 style="color: #2c3e50;">🎉 การจองของคุณเสร็จสมบูรณ์แล้ว!</h2>
    <p>สวัสดีคุณ <strong>${booking.user.username}</strong>,</p>
    <p>เราขอขอบคุณที่ใช้บริการของเรา! การจองของคุณได้รับการยืนยันเรียบร้อยแล้ว 🎯</p>
    <p><strong>รายละเอียดการจอง:</strong></p>
    <ul>
      <li>🏟 <strong>สนาม:</strong> ${booking.field.name}</li>
      <li>📅 <strong>วันที่:</strong> ${moment(booking.dueDate)
        .tz("Asia/Bangkok")
        .format("DD/MM/YYYY")}</li>
      <li>⏰ <strong>เวลา:</strong> ${moment(booking.startTime)
        .tz("Asia/Bangkok")
        .format("HH:mm")} - ${moment(booking.endTime)
      .tz("Asia/Bangkok")
      .format("HH:mm")}</li>
      <li>💰 <strong>ค่าบริการทั้งหมด:</strong> ฿${booking.totalCost.toFixed(
        2
      )}</li>
    </ul>
    <p>⏳ โปรดมาถึงสนามก่อนเวลาเพื่อเช็กอิน และอย่าลืมนำหลักฐานการจองของคุณมาด้วย!</p>
    <p>หากมีข้อสงสัยหรือต้องการเปลี่ยนแปลงการจอง กรุณาติดต่อเราทางอีเมลนี้</p>
    <p>ขอบคุณที่ใช้บริการ 🙏</p>
    <hr />
    <p style="font-size: 12px; color: #7f8c8d;">📌 อีเมลนี้เป็นการแจ้งเตือนอัตโนมัติ กรุณาอย่าตอบกลับ</p>
  `;

    await sendEmail(
      booking.user.email,
      "การจองสนามของคุณสำเร็จ",
      customerEmailContent
    );

    // ส่งอีเมลไปยังแอดมิน
    const adminEmailContent = `
    <h2 style="color: #c0392b;">📢 มีการจองใหม่เข้ามา!</h2>
    <p>🆕 <strong>ผู้ใช้:</strong> ${booking.user.username} ได้ทำการจองสนาม</p>
    <p><strong>รายละเอียดการจอง:</strong></p>
    <ul>
      <li>🏟 <strong>สนาม:</strong> ${booking.field.name}</li>
      <li>📅 <strong>วันที่:</strong> ${moment(booking.dueDate)
        .tz("Asia/Bangkok")
        .format("DD/MM/YYYY")}</li>
      <li>⏰ <strong>เวลา:</strong> ${moment(booking.startTime)
        .tz("Asia/Bangkok")
        .format("HH:mm")} - ${moment(booking.endTime)
      .tz("Asia/Bangkok")
      .format("HH:mm")}</li>
      <li>💰 <strong>ค่าบริการทั้งหมด:</strong> ฿${booking.totalCost.toFixed(
        2
      )}</li>
    </ul>
    <p>📌 โปรดตรวจสอบสถานะการชำระเงินและอัปเดตระบบหากจำเป็น</p>
    <p>🔍 ดูข้อมูลเพิ่มเติมที่ระบบหลังบ้าน</p>
    <hr />
    <p style="font-size: 12px; color: #7f8c8d;">📌 อีเมลนี้เป็นการแจ้งเตือนอัตโนมัติ</p>
  `;
    await sendEmail(
      "taikung3133@gmail.com",
      "การจองใหม่จากผู้ใช้",
      adminEmailContent
    );

    // ถ้ามีการอัปโหลด slip ให้สร้าง record ใน Payment
    if (slipUrl) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          slip: slipUrl,
          paymentDate: moment().tz("Asia/Bangkok").toDate(), // บันทึกวันที่ชำระเงินเป็นเวลาปัจจุบัน
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

    // ดึงข้อมูลการจองที่มีสถานะ Completed พร้อมราคาฟิลด์ที่เลือก
    const bookings = await db.Booking.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lt: endDate,
        },
        status: "Completed", // เพิ่มเงื่อนไขให้ดึงเฉพาะที่สถานะ Completed
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
        .json({ message: "No completed bookings found for this month." });
    }

    // คำนวณราคารวมสำหรับการจองทั้งหมดในเดือนนี้
    let totalPrice = 0;
    const formattedBookings = bookings.map((booking) => {
      const fieldPricePerHour = booking.field ? booking.field.pricePerHour : 0; // ราคาแต่ละสนามต่อชั่วโมง

      // คำนวณเวลาระหว่าง startTime และ endTime
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);

      // กำหนดตัวเลือกในการแสดงเวลาเป็นชั่วโมงและนาที
      const options = { hour: "2-digit", minute: "2-digit", hour12: false };

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
          ? new Date(booking.dueDate).toLocaleDateString("th-TH")
          : "Unknown",
        startTime: startTime.toLocaleTimeString("th-TH", options), // 24 ชั่วโมง
        endTime: endTime.toLocaleTimeString("th-TH", options), // 24 ชั่วโมง
        hours: hours.toFixed(2),
        price: bookingPrice.toFixed(2),
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

    // ส่งอีเมลไปยังผู้ใช้
    const customerEmailContent = `
      <h3>การจองของคุณถูกยกเลิก</h3>
      <p>การจองของคุณสำหรับสนาม ${updatedBooking.field.name} ถูกยกเลิกแล้ว</p>
      <p>หากคุณต้องการทำการจองใหม่ โปรดติดต่อเรา 088 355 3523</p>
    `;
    await sendEmail(
      updatedBooking.user.email,
      "การจองของคุณถูกยกเลิก",
      customerEmailContent
    );

    // ส่งอีเมลไปยังแอดมิน
    const adminEmailContent = `
      <h3>การจองถูกยกเลิก</h3>
      <p>การจองของผู้ใช้ ${updatedBooking.user.username} สำหรับสนาม ${updatedBooking.field.name} ถูกยกเลิก</p>
    `;
    await sendEmail("ใส่เมลแอดมิน", "การจองถูกยกเลิก", adminEmailContent); //ใส่เมลแอดมิน

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

    // ส่งอีเมลไปยังผู้ใช้
    const customerEmailContent = `
      <h3>การจองของคุณได้รับการยืนยัน</h3>
      <p>การจองของคุณสำหรับสนาม ${updatedBooking.field.name} ได้รับการยืนยันแล้ว</p>
      <p>กรุณาตรวจสอบรายละเอียดการจองของคุณ</p>
    `;
    await sendEmail(
      updatedBooking.user.email,
      "การจองของคุณได้รับการยืนยัน",
      customerEmailContent
    );

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
          in: ["Pending", "Confirm"],
        },
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

// ดึงประวัติการจอง (Completed, Cancel)
exports.getHistoryBookingsID = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
        status: {
          in: ["Completed", "Cancel"],
        },
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

// ดึงการจองปัจจุบัน (Pending, Confirm)
exports.getCurrentBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["Pending", "Confirm"],
        },
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

// ดึงประวัติการจอง (Completed, Cancel)
exports.getHistoryBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["Completed", "Cancel"],
        },
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

exports.getPendingBookings = async (req, res) => {
  try {
    const pendingBookings = await prisma.booking.findMany({
      where: {
        status: "Pending",
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
