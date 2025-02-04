require('dotenv').config();  
const express = require('express');  
const cors = require('cors');  
const path = require('path');

const notFound = require('./middlewares/notFound');  
const errorMiddleware = require('./middlewares/error'); 
const authRoute = require('./routes/auth-routes');  
const fieldRoute = require('./routes/field-routes');  
const bookingRoute = require('./routes/booking-touter');  
const pullRoute = require('./routes/pull-router'); 

const app = express();  // สร้างแอปพลิเคชัน Express

// ใช้งาน CORS middleware เพื่อให้เซิร์ฟเวอร์รองรับการขอข้อมูลจากโดเมนต่างๆ
app.use(cors());

// ใช้ express.json() เพื่อให้แอปพลิเคชันสามารถรับ JSON payload ใน HTTP request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
