import db from "../../../config/firebase.js";

export const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const updatedData = req.body;

    await db.collection("food").doc(foodId).update(updatedData);
    return res.status(200).json({ message: "Updated", foodId });
  } catch (error) {
    console.error("Error updating food:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
