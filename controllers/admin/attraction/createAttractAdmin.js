import db from "../../../config/firebase.js";

export const createAttraction = async (req, res) => {
  try {
    const data = req.body;

    const snapshot = await db.collection("attraction").get();
    const newId = (snapshot.size + 1).toString();
    const doc = {
      attId: newId,
      ...data,
    };

    await db.collection("attraction").doc(newId).set(doc);
    res.status(201).json({ message: "Attraction created", id: newId });
  } catch (error) {
    console.error("Create attraction error:", error);
    res.status(500).json({ error: "Failed to create attraction" });
  }
};
