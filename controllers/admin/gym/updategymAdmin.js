import db from "../../../config/firebase.js";

export const updateGymAdmin = async (req, res) => {
  const { gymId } = req.params;
  const updateData = req.body;

  try {
    const docRef = db.collection("detailGym").doc(gymId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Gym not found" });
    }

    await docRef.update(updateData);
    return res.status(200).json({ message: "Gym updated successfully" });
  } catch (error) {
    console.error("Error updating gym:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
