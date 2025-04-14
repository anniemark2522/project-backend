import db from "../../../config/firebase.js";

export const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    await db.collection("food").doc(foodId).delete();
    return res.status(200).json({ message: "Deleted", foodId });
  } catch (error) {
    console.error("Error deleting food:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
