import db from "../../../config/firebase.js";

export const getAttractionsAdmin = async (req, res) => {
  try {
    const snapshot = await db.collection("attraction").get();
    const data = snapshot.docs.map((doc) => doc.data());
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attractions" });
  }
};