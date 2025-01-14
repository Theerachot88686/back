require('dotenv').config();  // โหลดไฟล์ .env เพื่อใช้งานค่าตัวแปรสภาพแวดล้อม
const express = require('express');  // นำเข้า express สำหรับสร้างเว็บเซิร์ฟเวอร์
const cors = require('cors');  // นำเข้า cors สำหรับจัดการ Cross-Origin Resource Sharing (CORS)
const notFound = require('./middlewares/notFound');  // Middleware สำหรับจัดการ 404 errors
const errorMiddleware = require('./middlewares/error');  // Middleware สำหรับจัดการ errors ทั่วไป
const authRoute = require('./routes/auth-routes');  // เส้นทางสำหรับการยืนยันตัวตน
const fieldRoute = require('./routes/field-routes');  // เส้นทางสำหรับการจัดการฟิลด์
const bookingRoute = require('./routes/booking-touter');  // เส้นทางสำหรับการจัดการการจอง
const pullRoute = require('./routes/pull-router');  // เส้นทางสำหรับดึงข้อมูลผู้ใช้ที่มี role = "user"

const app = express();  // สร้างแอปพลิเคชัน Express

// ใช้งาน CORS middleware เพื่อให้เซิร์ฟเวอร์รองรับการขอข้อมูลจากโดเมนต่างๆ
app.use(cors());

// ใช้ express.json() เพื่อให้แอปพลิเคชันสามารถรับ JSON payload ใน HTTP request
app.use(express.json());

// ตั้งค่าเส้นทางสำหรับการใช้งาน API
app.use('/auth', authRoute);  // สำหรับการจัดการการลงทะเบียนและการเข้าสู่ระบบ
app.use('/field', fieldRoute);  // สำหรับการจัดการฟิลด์
app.use('/booking', bookingRoute);  // สำหรับการจัดการการจอง
app.use('/get', pullRoute);  // สำหรับการดึงข้อมูลผู้ใช้ที่มี role = "user"

// ตั้งค่า Middleware สำหรับจัดการข้อผิดพลาด (404 และข้อผิดพลาดอื่นๆ)
app.use(notFound);  // ถ้าไม่พบเส้นทาง จะส่งกลับ 404
app.use(errorMiddleware);  // จัดการข้อผิดพลาดที่เกิดขึ้นในแอปพลิเคชัน

// กำหนดหมายเลขพอร์ตในการรันเซิร์ฟเวอร์
const port = process.env.PORT || 8000;

// เริ่มเซิร์ฟเวอร์และแสดงข้อความเมื่อเซิร์ฟเวอร์รัน
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
