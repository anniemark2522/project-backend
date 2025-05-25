import db from "../../../config/firebase.js";

export const addGymClass = async (req, res) => {
  const { gymId } = req.params;
  const newClass = req.body;

  try {
    const docRef = db.collection("detailGymClasses").doc(gymId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      // กรณียังไม่มี doc → สร้างใหม่
      const gymSnap = await db.collection("detailGym").doc(gymId).get();
      const meta = gymSnap.exists ? gymSnap.data() : {};

      await docRef.set({
        gymId,
        classes: [newClass],
        name: meta.name || "",
        location: meta.location || "",
        province: meta.province || "",
        gymDescription: meta.description || "",
        openHours: meta.openHours || {},
        url: meta.url || "",
      });
    } else {
      // ถ้ามีอยู่แล้ว → อัปเดตคลาสใหม่เข้าไปใน array
      const data = docSnap.data();
      const updatedClasses = [...(data.classes || []), newClass];

      await docRef.update({
        classes: updatedClasses,
      });
    }

    return res.status(200).json({ message: "Class added successfully" });
  } catch (error) {
    console.error("Error adding gym class:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
