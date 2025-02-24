const FormData = require('form-data'); // ใช้สำหรับส่งข้อมูลแบบ form-data
const axios = require("axios");
const fs = require("fs");

const SLIPOK_API_KEY = "SLIPOKOT1QU8Q"; // ใส่ API Key ของคุณ

const checkSlipWithSlipOK = async (filePath) => {
  try {
    const form = new FormData();
    form.append('files', fs.createReadStream(filePath)); // ส่งไฟล์รูปภาพสลิป

    const response = await axios.post(
      "https://api.slipok.com/api/line/apikey/39819",  // ใช้ URL ของ API ที่ถูกต้อง
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          'x-authorization': SLIPOK_API_KEY,
          ...form.getHeaders(), // เพิ่ม headers ของ form-data
        },
      }
    );

    console.log("📄 ผลการตรวจสอบสลิป:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ ตรวจสอบสลิปล้มเหลว:", error.response?.data || error.message);
    return { success: false, message: "❌ ไม่สามารถตรวจสอบสลิปได้" };
  }
};

module.exports = { checkSlipWithSlipOK };
