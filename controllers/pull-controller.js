const db = require("../models/db");
// นำเข้าโมดูลสำหรับเชื่อมต่อกับฐานข้อมูล

// Controller สำหรับดึงข้อมูลผู้ใช้ที่มี role = "user"
exports.getUsersWithRole = async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้ที่มี role เป็น "user"
    const users = await db.user.findMany({
      where: {
        role: 'user', // กำหนดเงื่อนไขว่าต้องเป็นผู้ใช้ที่มี role เท่ากับ "user"
      },
      include: {
        bookings: true, // ดึงข้อมูลการจอง (booking) ของผู้ใช้นั้นๆ ถ้ามี
      },
    });

    // ส่งข้อมูลผู้ใช้ที่ค้นหาไปยัง client
    res.status(200).json(users);
    // ส่งสถานะ HTTP 200 (OK) พร้อมข้อมูลผู้ใช้ในรูปแบบ JSON
  } catch (error) {
    console.error(error);
    // แสดงข้อผิดพลาดใน console เพื่อใช้ debug
    res.status(500).json({ error: 'Failed to fetch users' });
    // ส่งสถานะ HTTP 500 (Internal Server Error) พร้อมข้อความข้อผิดพลาดในรูปแบบ JSON
  }
};
