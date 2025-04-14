// controllers/admin/classes/updategymClassAdmin.js
import db from "../../../config/firebase.js";

export const updateGymClass = async (req, res) => {
  const { gymId, index } = req.params;
  const updatedClass = req.body;

  try {
    const snapshot = await db
      .collection("detailGymClasses")
      .where("gymId", "==", gymId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Gym classes not found" });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    const classes = data.classes || [];

    if (parseInt(index) < 0 || parseInt(index) >= classes.length) {
      return res.status(400).json({ error: "Invalid class index" });
    }

    classes[parseInt(index)] = updatedClass;

    await db.collection("detailGymClasses").doc(doc.id).update({ classes });

    return res.status(200).json({ message: "Class updated successfully" });
  } catch (error) {
    console.error("Error updating gym class:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
