import db from "../../../config/firebase.js";

export const getFoodsAdmin = async (req, res) => {
  try {
    const snapshot = await db.collection("food").get();
    const data = snapshot.docs.map(doc => ({ foodId: doc.id, ...doc.data() }));
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching food data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
