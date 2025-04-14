import db from "../../../config/firebase.js";

export const createFood = async (req, res) => {
  try {
    const { name, location, province, type, open_hours, phone, parking, website, map_url, image } = req.body;

    if (!name || !province) return res.status(400).json({ message: "Missing required fields" });

    const snapshot = await db.collection("food").get();
    const ids = snapshot.docs.map(doc => parseInt(doc.id)).filter(id => !isNaN(id));
    const nextId = ids.length ? Math.max(...ids) + 1 : 1;

    const foodData = {
      name, location, province, type, open_hours, phone, parking, website, map_url, image,
    };

    await db.collection("food").doc(String(nextId)).set(foodData);
    return res.status(201).json({ message: "Created", foodId: nextId });
  } catch (error) {
    console.error("Error creating food:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
