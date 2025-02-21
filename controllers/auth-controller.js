const { Resend } = require("resend");
const bcrypt = require("bcrypt"); // หรือใช้ bcryptjs แทน
const db = require("../models/db");
const crypto = require("crypto");
const moment = require("moment");
const nodemailer = require("nodemailer");

module.exports.register = async (req, res, next) => {
  const { username, password, confirmPassword, email } = req.body;

  try {
    // ✅ ตรวจสอบว่า input ครบหรือไม่
    if (!username || !password || !confirmPassword || !email) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }
    // ✅ ตรวจสอบว่า "ชื่อผู้ใช้" มีอยู่ในฐานข้อมูลหรือยัง
    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" });
    }

    // ✅ ตรวจสอบว่า "อีเมล" มีอยู่ในฐานข้อมูลหรือยัง
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้ไปแล้ว" });
    }

    
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    console.log("ผู้ใช้ที่สร้าง:", newUser);

    return res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    return next(err);
  }
};


module.exports.login = async (req, res, next) => {
  // ฟังก์ชันสำหรับการเข้าสู่ระบบ
  const { username, password } = req.body;
  try {
    // ตรวจสอบว่า input ไม่ว่าง
    if (!(username.trim() && password.trim())) {
      throw new Error("username or password must not blank");
    }

    // ค้นหาผู้ใช้ในฐานข้อมูลตาม username
    const user = await db.user.findFirstOrThrow({ where: { username } });

    // ตรวจสอบว่า password ตรงกันหรือไม่
    if (user.password !== password) {
      throw new Error("Invalid login credentials");
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // **หมายเหตุ**: มีส่วนออกความคิดเห็นเกี่ยวกับการสร้าง JWT token (ถูกคอมเมนต์ไว้)

    res.json(user);
    // ส่งข้อมูลผู้ใช้กลับไป
  } catch (err) {
    next(err);
    // ส่ง error ไปยัง middleware สำหรับจัดการข้อผิดพลาด
  }
};

module.exports.updateUser = async (req, res, next) => {
  // ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
  const { username, password, email } = req.body;
  const { id } = req.params;

  // แปลง id ให้เป็นจำนวนเต็ม
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return next(new Error("Invalid user ID"));
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

    res.json({ msg: "User updated successfully", user: updatedUser });
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
    return next(new Error("Invalid user ID"));
    // ส่ง error หาก ID ไม่ถูกต้อง
  }

  try {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const user = await db.user.findFirstOrThrow({ where: { id: userId } });

    // ลบผู้ใช้ในฐานข้อมูล
    await db.user.delete({ where: { id: userId } });

    res.json({ msg: "User deleted successfully" });
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

module.exports.requestResetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await db.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "Email not found" });
    }
    // สร้างรหัสลับแบบ 6 หลัก (เฉพาะตัวเลข)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // ตั้งเวลาใช้งานรหัสลับเหลือ 5 นาที (300,000 มิลลิวินาที)
    const resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // บันทึกรหัสลับในฐานข้อมูล
    await db.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // ตั้งค่า Nodemailer สำหรับ Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "taikung3133@gmail.com", // เปลี่ยนเป็นอีเมล Gmail ของคุณ
        pass: "cqgz hczx yayd wolu", // ใช้ App Password แทนรหัสผ่านปกติ
      },
    });

    // ตั้งค่าอีเมลที่จะส่ง
    const mailOptions = {
      from: "your_email@gmail.com", // อีเมลผู้ส่ง (ต้องตรงกับ SMTP)
      to: email, // อีเมลผู้รับ
      subject: "Reset your password",
      html: `
        <h3>คุณขอรีเซ็ตรหัสผ่าน</h3>
        <p>กรุณากรอกรหัสลับต่อไปนี้ในหน้าเว็บเพื่อรีเซ็ตรหัสผ่านของคุณ:</p>
        <p><strong>${resetToken}</strong></p>
        
      `,
    };

    // ส่งอีเมล
    await transporter.sendMail(mailOptions);

    res.json({ msg: "Password reset email sent", resetToken });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

// ฟังก์ชันสำหรับรีเซ็ตรหัสผ่าน
module.exports.resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() }, // ตรวจสอบว่ารหัสลับยังไม่หมดอายุ
      },
    });

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    // อัปเดตรหัสผ่านใหม่
    await db.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
        resetToken: null, // ลบรหัสลับหลังการใช้
        resetTokenExpiry: null,
      },
    });

    res.json({ msg: "Password reset successfully" }); // ส่งข้อความยืนยันการรีเซ็ตรหัสผ่าน
  } catch (err) {
    next(err); // ส่ง error ไปยัง middleware สำหรับจัดการข้อผิดพลาด
  }
};
