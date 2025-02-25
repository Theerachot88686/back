const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function uploadToImgBB(file) {
  try {
    const apiKey = "ba9af64bebc3955c2b55f54fc52aca2f"; // ใส่ API Key ของคุณ

    if (!file || !file.path) {
      throw new Error("❌ No file path received.");
    }

    // อ่านไฟล์จากระบบเป็น buffer
    const fileBuffer = fs.readFileSync(file.path);

    // แปลง buffer เป็น base64
    const base64Image = fileBuffer.toString("base64");

    // ✅ ใช้ FormData แทน query params
    const form = new FormData();
    form.append("key", apiKey);
    form.append("image", base64Image);

    // ✅ ส่งเป็น `multipart/form-data`
    const response = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
    });

    console.log("✅ Upload successful:", response.data.data.url);
    return response.data.data.url;
  } catch (error) {
    console.error("❌ Upload to ImgBB failed:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { uploadToImgBB };
