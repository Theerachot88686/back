const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");



async function checkDBConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
}

checkDBConnection();

const uploadToImgBB = async (fileBuffer) => {
  const base64Image = fileBuffer.toString("base64"); // ✅ แปลงไฟล์เป็น Base64
  const formData = new FormData();
  formData.append("image", base64Image);
  formData.append("key", "ba9af64bebc3955c2b55f54fc52aca2f"); // ✅ ใส่ API Key ของ ImgBB

  try {
    const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
      headers: { 
        ...formData.getHeaders(), // ✅ ใช้ headers ที่ถูกต้อง
      },
    });

    console.log("✅ ImgBB Response:", response.data);
    return response.data.data.url; // ✅ คืน URL ของรูปที่อัปโหลดสำเร็จ
  } catch (error) {
    console.error("❌ Error uploading image to ImgBB:", error.response ? error.response.data : error.message);
    return null;
  }
};

exports.getRecentCompetitions = async (req, res, next) => {
  try {
    // ดึงข้อมูล 3 รายการล่าสุดจากฐานข้อมูล
    const competitions = await prisma.competition.findMany({
      orderBy: {
        id: 'desc',  // เรียงลำดับจากใหม่ไปเก่า
      },
      take: 3,  // จำกัดผลลัพธ์ให้แสดง 3 รายการ
    });
    res.status(200).json(competitions); // ส่งข้อมูล 3 รายการล่าสุด
  } catch (err) {
    console.error("Error fetching recent competitions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  
exports.getCompetitions = async (req, res, next) => {
  try {
    const competitions = await prisma.competition.findMany(); // ดึงข้อมูลการแข่งขันทั้งหมด
    res.status(200).json(competitions);
  } catch (err) {
    console.error("Error fetching competitions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCompetitionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const competition = await prisma.competition.findUnique({
      where: { id: parseInt(id, 10) }, // ✅ แปลง id เป็น Number
    });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.status(200).json(competition); // ส่งข้อมูลการแข่งขันที่เลือก
  } catch (err) {
    console.error("Error fetching competition:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createCompetition = async (req, res, next) => {
  const { title, dec1, dec2, dec3, dec4, dec5, dec6, link, image } = req.body;

  try {
    const newCompetition = await prisma.competition.create({
      data: { title, dec1, dec2, dec3, dec4, dec5, dec6, link, image }, // ✅ image มาจาก URL
    });

    res.status(201).json({ message: "✅ Competition created successfully", competition: newCompetition });
  } catch (err) {
    console.error("❌ Error creating competition:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




exports.updateCompetition = async (req, res, next) => {
  const { id } = req.params;
  const { title, dec1, dec2, dec3, dec4, dec5, dec6, link } = req.body;
  let imageUrl = null; // ✅ กำหนดค่าเริ่มต้น

  if (req.file) {
    imageUrl = await uploadToImgBB(req.file.buffer);
    if (!imageUrl) return res.status(500).json({ error: "Failed to upload image" });
  }

  try {
    const updatedCompetition = await prisma.competition.update({
      where: { id },
      data: { 
        title, 
        dec1, 
        dec2, 
        dec3, 
        dec4, 
        dec5, 
        dec6, 
        link,
        ...(imageUrl && { image: imageUrl }), // ✅ อัปเดตเฉพาะเมื่อมีรูปใหม่
      },
    });

    res.status(200).json({ message: "✅ Competition updated successfully", competition: updatedCompetition });
  } catch (err) {
    console.error("❌ Error updating competition:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.deleteCompetition = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.competition.delete({
      where: { id },
    });

    res.status(200).json({ message: "Competition deleted successfully" });
  } catch (err) {
    console.error("Error deleting competition:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};