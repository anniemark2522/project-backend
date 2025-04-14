import db from "../../../config/firebase.js";

export const deleteAttraction = async (req, res) => {
  try {
    const { attId } = req.params;
    await db.collection("attraction").doc(attId).delete();
    res.json({ message: "Attraction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete attraction" });
  }
};