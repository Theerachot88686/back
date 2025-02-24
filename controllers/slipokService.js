const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const https = require("https");

const SLIPOK_API_KEY = "SLIPOKOT1QU8Q"; // ใส่ API Key ของคุณ

const checkSlipWithSlipOK = async (imgbbUrl) => {
  try {
    // ดาวน์โหลดไฟล์จาก ImgBB
    const filePath = path.join(__dirname, "temp_slip.jpg"); // ตั้งชื่อไฟล์ชั่วคราว
    const writer = fs.createWriteStream(filePath);

    // ดาวน์โหลดไฟล์จาก ImgBB
    const response = await axios({
      url: imgbbUrl,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    // รอให้ดาวน์โหลดเสร็จ
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // ส่งไฟล์ไปที่ SlipOK API
    const form = new FormData();
    form.append('files', fs.createReadStream(filePath)); // ส่งไฟล์สลิปที่ดาวน์โหลดมา

    const apiResponse = await axios.post(
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

    console.log("📄 ผลการตรวจสอบสลิป:", apiResponse.data);
    fs.unlinkSync(filePath); // ลบไฟล์ที่ดาวน์โหลดหลังการใช้งานเสร็จ

    return apiResponse.data;
  } catch (error) {
    console.error("❌ ตรวจสอบสลิปล้มเหลว:", error.response?.data || error.message);
    return { success: false, message: "❌ ไม่สามารถตรวจสอบสลิปได้" };
  }
};

module.exports = { checkSlipWithSlipOK };
