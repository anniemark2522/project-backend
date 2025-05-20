import db from "../../config/firebase.js";

export const getGymLatLngById = async (req, res) => {
  const { gymId } = req.params;

  if (!gymId) {
    return res.status(400).json({ error: "Missing gymId" });
  }

  try {
    const doc = await db.collection("GymsLatLong").doc(gymId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Gym not found" });
    }

    return res.status(200).json(doc.data());
  } catch (error) {
    console.error("[Admin] Error fetching gym lat/long:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
