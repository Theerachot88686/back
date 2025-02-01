const db = require("../models/db");
const moment = require('moment');
// นำเข้าฐานข้อมูลผ่านโมดูล db

module.exports.register = async (req, res, next) => {
  // ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ใหม่
  const { username, password, confirmPassword, email } = req.body;
  try {
    // ตรวจสอบว่า input ไม่ว่าง
    if (!(username && password && confirmPassword)) {
      return next(new Error("Fulfill all inputs"));
    }
    // ตรวจสอบว่า confirmPassword ตรงกับ password หรือไม่
    if (confirmPassword !== password) {
      throw new Error("confirm password not match");
    }

    // เตรียมข้อมูลผู้ใช้
    const data = { username, password, email };

    // สร้างผู้ใช้ใหม่ในฐานข้อมูล
    const rs = await db.user.create({ data });
    console.log(rs);

    res.json({ msg: 'Register successful' });
    // ส่งข้อความยืนยันการลงทะเบียนสำเร็จกลับไป
  } catch (err) {
    next(err);
    // ส่ง error ไปยัง middleware สำหรับจัดการข้อผิดพลาด
  }
};

module.exports.login = async (req, res, next) => {
  // ฟังก์ชันสำหรับการเข้าสู่ระบบ
  const { username, password } = req.body;
  try {
    // ตรวจสอบว่า input ไม่ว่าง
    if (!(username.trim() && password.trim())) {
      throw new Error('username or password must not blank');
    }

    // ค้นหาผู้ใช้ในฐานข้อมูลตาม username
    const user = await db.user.findFirstOrThrow({ where: { username } });

    // ตรวจสอบว่า password ตรงกันหรือไม่
    if (user.password !== password) {
      throw new Error('Invalid login credentials');
    }

    // **หมายเหตุ**: มีส่วนออกความคิดเห็นเกี่ยวกับการสร้าง JWT token (ถูกคอมเมนต์ไว้)

    res.json(user);
    // ส่งข้อมูลผู้ใช้กลับไป
  } catch (err) {
    next(err);
    // ส่ง error ไปยัง middleware สำหรับจัดการข้อผิดพลาด
  }
};

module.exports.getLastLogin = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await db.user.findFirstOrThrow({
      where: { username },
      select: { last_login: true },
    });

    const lastLoginFormatted = user.last_login
      ? moment(user.last_login).format('YYYY-MM-DD HH:mm:ss')
      : 'Never logged in';

    res.json({ username, last_login: lastLoginFormatted });
  } catch (err) {
    next(err);
  }
};



module.exports.updateUser = async (req, res, next) => {
  // ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
  const { username, password, email } = req.body;
  const { id } = req.params;

  // แปลง id ให้เป็นจำนวนเต็ม
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return next(new Error('Invalid user ID'));
    // ส่ง error หาก ID ไม่ถูกต้อง
  }

  try {
    // ตรวจสอบว่า input ไม่ว่าง
    if (!(username && password && email)) {
      return next(new Error("Fulfill all inputs"));
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const user = await db.user.findFirstOrThrow({ where: { id: userId } });

    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { username, password, email, updatedAt: new Date() },
    });

    res.json({ msg: 'User updated successfully', user: updatedUser });
    // ส่งข้อความยืนยันการอัปเดตสำเร็จพร้อมข้อมูลผู้ใช้ใหม่
  } catch (err) {
    next(err);
    // ส่ง error ไปยัง middleware สำหรับจัดการข้อผิดพลาด
  }
};

module.exports.deleteUser = async (req, res, next) => {
  // ฟังก์ชันสำหรับลบข้อมูลผู้ใช้
  const { id } = req.params;

  // แปลง id ให้เป็นจำนวนเต็ม
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return next(new Error('Invalid user ID'));
    // ส่ง error หาก ID ไม่ถูกต้อง
  }

  try {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const user = await db.user.findFirstOrThrow({ where: { id: userId } });

    // ลบผู้ใช้ในฐานข้อมูล
    await db.user.delete({ where: { id: userId } });

    res.json({ msg: 'User deleted successfully' });
    // ส่งข้อความยืนยันการลบสำเร็จกลับไป
  } catch (err) {
    next(err);
    // ส่ง error ไปยัง middleware สำหรับจัดการข้อผิดพลาด
  }
};

exports.getUsers = async (req, res, next) => {
  // ฟังก์ชันสำหรับดึงรายชื่อผู้ใช้
  try {
    const users = await db.user.findMany({
      select: {
        id: true, // ดึงเฉพาะ `id`
        username: true, // และ `username`
      },
      where: { role: "user" }, // เงื่อนไข: role เป็น "user"
    });

    res.status(200).json(users);
    // ส่งรายชื่อผู้ใช้กลับไปในรูปแบบ JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
    // ส่ง error 500 หากเกิดปัญหา
  }
};
