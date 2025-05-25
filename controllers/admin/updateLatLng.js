// controllers/updateLatLng.js
import db from "../../config/firebase.js";

export const updateLatLng = async (req, res) => {
  const { gymId, lat, long } = req.body;

  if (!gymId || !lat || !long) {
    return res.status(400).json({ error: "Missing gymId, lat, or long" });
  }

  try {
    const docRef = db.collection("GymsLatLong").doc(gymId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Gym not found" });
    }

    await docRef.update({
      lat,
      long,
    });

    return res.status(200).json({ message: "Lat/Lng updated successfully" });
  } catch (error) {
    console.error("Error updating Lat/Lng:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
