// controllers/admin/classes/addgymClassAdmin.js
import db from "../../../config/firebase.js";

export const addGymClass = async (req, res) => {
  const { gymId } = req.params;
  const newClass = req.body;

  try {
    const snapshot = await db
      .collection("detailGymClasses")
      .where("gymId", "==", gymId)
      .get();

    if (snapshot.empty) {
      await db.collection("detailGymClasses").add({
        gymId,
        classes: [newClass],
      });
    } else {
      const doc = snapshot.docs[0];
      const data = doc.data();
      const updatedClasses = [...(data.classes || []), newClass];
      await db.collection("detailGymClasses").doc(doc.id).update({
        classes: updatedClasses,
      });
    }

    return res.status(200).json({ message: "Class added successfully" });
  } catch (error) {
    console.error("Error adding gym class:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
