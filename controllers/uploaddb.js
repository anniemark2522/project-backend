import db from "../config/firebase.js"; // การเชื่อมต่อกับ Firebase

// ฟังก์ชันสำหรับอัปโหลด JSON ไปยัง Firestore
export const uploadJSON = async (req, res) => {
  try {
    const data = req.body;  // รับ JSON จาก body ของ request

    // เช็คว่า data มีข้อมูลหรือไม่
    if (!data) {
      return res.status(400).json({ error: "No JSON data provided." });
    }

    // อัปโหลดข้อมูลไปยัง Firestore
    const collectionRef = db.collection("your_collection_name");  
    const docRef = await collectionRef.add(data);  

    return res.status(200).json({
      message: "Data uploaded successfully",
      documentId: docRef.id,
    });
  } catch (error) {
    console.error("Error uploading data to Firestore:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

};


