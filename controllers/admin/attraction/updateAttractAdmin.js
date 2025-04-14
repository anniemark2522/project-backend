import db from "../../../config/firebase.js";

export const updateAttraction = async (req, res) => {
  try {
    const data = req.body;
    if (!data.attId) return res.status(400).json({ error: "Missing attId" });
    await db.collection("attraction").doc(data.attId).update(data);
    res.json({ message: "Attraction updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update attraction" });
  }
};