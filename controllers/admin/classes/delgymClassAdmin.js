// controllers/admin/classes/gymClassAdmin.js
import db from "../../../config/firebase.js";

export const deleteGymClass = async (req, res) => {
  const { gymId, index } = req.params;

  try {
    const snapshot = await db
      .collection("detailGymClasses")
      .where("gymId", "==", gymId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Gym classes not found" });
    }

    const doc = snapshot.docs[0];
    const docId = doc.id;
    const data = doc.data();
    const classes = data.classes || [];

    const classIndex = parseInt(index, 10);
    if (isNaN(classIndex) || classIndex < 0 || classIndex >= classes.length) {
      return res.status(400).json({ message: "Invalid class index" });
    }

    const updatedClasses = classes.filter((_, i) => i !== classIndex);

    await db.collection("detailGymClasses").doc(docId).update({ classes: updatedClasses });

    return res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting class:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
