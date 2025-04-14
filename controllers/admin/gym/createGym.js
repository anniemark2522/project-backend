import db from "../../../config/firebase.js";

export const createGym = async (req, res) => {
  try {
    const {
      name,
      url,
      description,
      openHours,
      location,
      image,
      province,
    } = req.body;

    // ตรวจสอบ field ที่จำเป็น
    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    // 🔢 คำนวณ gymId ใหม่ (max + 1)
    const snapshot = await db.collection("detailGym").get();
    const ids = snapshot.docs
      .map(doc => parseInt(doc.id))
      .filter(n => !isNaN(n));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    const gymId = String(nextId);

    // เตรียมข้อมูล
    const newGymData = {
      gymId,
      name,
      url: url || "",
      description: description || "",
      openHours: openHours || {},
      location,
      image: image || [],
      province: province || "",
    };

    // บันทึกลง Firebase
    await db.collection("detailGym").doc(gymId).set(newGymData);

    return res.status(201).json({
      message: "Gym created successfully",
      gymId,
      data: newGymData,
    });
  } catch (error) {
    console.error("❌ Error creating gym:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
