const db = require("../models/db");

// Controller สำหรับดึงข้อมูลผู้ใช้ที่มี role = "user"
exports.getUsersWithRole = async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้ที่มี role เป็น "user"
    const users = await db.user.findMany({
      where: {
        role: 'user',
      },
      include: {
        bookings: true, // เพิ่มข้อมูล booking ถ้าจำเป็น
      },
    });

    // ส่งข้อมูลผู้ใช้ที่ค้นหาไปยัง client
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
