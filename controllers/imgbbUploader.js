const axios = require("axios");
const FormData = require("form-data");

async function uploadToImgBB(imageBuffer) {
  try {
    const apiKey = "ba9af64bebc3955c2b55f54fc52aca2f"; // ใส่ API Key
    const form = new FormData();
    form.append("key", apiKey);
    form.append("image", imageBuffer.toString("base64")); // แปลง Buffer เป็น Base64

    const response = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
    });

    return response.data.data.url; // คืน URL ของรูป
  } catch (error) {
    console.error("❌ Upload to ImgBB failed:", error);
    throw error;
  }
}

module.exports = { uploadToImgBB };
