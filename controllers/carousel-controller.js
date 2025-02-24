const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data"); // ต้องใช้ form-data package

// ตั้งค่าอัปโหลดไฟล์ (เก็บในหน่วยความจำ)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ดึงข้อมูลทั้งหมดจากฐานข้อมูล
exports.getCarousels = async (req, res) => {
  try {
    const carousels = await prisma.carousel.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(carousels);
  } catch (error) {
    res.status(500).json({ error: "Error fetching carousels." });
  }
};

// ฟังก์ชันอัปโหลดรูปไป ImgBB
const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file); // ใส่ไฟล์โดยตรง ไม่ต้องแปลง Base64

  try {
    const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
      params: {
        key: "ba9af64bebc3955c2b55f54fc52aca2f", // ใส่ API Key ตรง ๆ
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.url; // คืนค่า URL ของรูปที่อัปโหลดสำเร็จ
  } catch (error) {
    console.error("❌ Error uploading image to ImgBB:", error);
    return null;
  }
};



// สร้าง Carousel ใหม่ (อัปโหลดรูปไป ImgBB)
exports.createCarousel = async (req, res) => {
  try {
    // ✅ ตรวจสอบว่าได้รับไฟล์จาก request หรือไม่
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Image file is required." });
    }

    // ✅ ตรวจสอบประเภทไฟล์ (อนุญาตเฉพาะ JPG, PNG, GIF)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type. Only JPG, PNG, and GIF are allowed." });
    }

    // ✅ ใช้ FormData แทนการส่ง Base64 ในพารามิเตอร์
    const formData = new FormData();
    formData.append("image", req.file.buffer.toString("base64"));
    formData.append("key", "ba9af64bebc3955c2b55f54fc52aca2f"); // 🔥 ใส่ API Key ตรงๆ (หรือใช้ process.env)

    // ✅ อัปโหลดไป ImgBB ด้วย POST request
    const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
      headers: formData.getHeaders(),
    });

    // ✅ ดึง URL ของรูปที่อัปโหลดสำเร็จ
    const imageUrl = response.data.data.url;

    // ✅ บันทึกลงฐานข้อมูล
    const newCarousel = await prisma.carousel.create({
      data: { image: imageUrl },
    });

    res.status(201).json({
      message: "Carousel image created successfully",
      carousel: newCarousel,
    });
  } catch (error) {
    console.error("Error uploading to ImgBB:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error uploading to ImgBB." });
  }
};

// อัปเดตรูปภาพใน Carousel
exports.updateCarousel = async (req, res) => {
  const { id } = req.params;

  try {
    let updateData = {};
    if (req.file) {
      const imageUrl = await uploadToImgBB(req.file.buffer);
      updateData.image = imageUrl;
    }

    const updatedCarousel = await prisma.carousel.update({
      where: { id: Number(id) }, // ต้องแปลง id เป็น Number
      data: updateData,
    });

    res.status(200).json({ message: "Carousel image updated successfully", carousel: updatedCarousel });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error updating carousel." });
  }
};

// ลบรูปภาพจาก Carousel
exports.deleteCarousel = async (req, res) => {
  const { id } = req.params;
  console.log("Deleting carousel ID:", id); // 🛠 Debug

  if (!id) {
    return res.status(400).json({ error: "Missing carousel ID." });
  }

  try {
    await prisma.carousel.delete({ where: { id } }); // ❌ เอา Number() ออก
    res.status(200).json({ message: "Carousel image deleted successfully" });
  } catch (error) {
    console.error("Error deleting carousel:", error); // 🛠 Debug
    res.status(500).json({ error: "Error deleting carousel." });
  }
};


// ✅ ไม่ต้อง export upload เพราะใช้แค่ในไฟล์นี้
