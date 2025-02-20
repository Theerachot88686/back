const imgbbUploader = require("imgbb-uploader");
const fs = require("fs");

async function uploadToImgBB(imagePath) {
  try {
    const apiKey = "22f98630c9d8892101d54d0ea43b68a1"; // ใส่ API Key 
    const response = await imgbbUploader(apiKey, imagePath);

    // ลบไฟล์จากเซิร์ฟเวอร์หลังจากอัปโหลดเสร็จ
    fs.unlinkSync(imagePath);
    
    return response.url; // คืน URL ของรูป
  } catch (error) {
    console.error("Upload to ImgBB failed:", error);
    throw error;
  }
}

module.exports = { uploadToImgBB };
