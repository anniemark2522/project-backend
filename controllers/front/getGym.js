// controllers/public/getGyms.js
import db from "../../config/firebase.js";

export const getGyms = async (req, res) => {
  try {
    const { gymId, province, name } = req.query;
    let gyms = [];

    const snapshot = await db.collection("detailGym").get();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const gymData = {
        gymId: doc.id,
        name: data.name,
        url: data.url,
        location: data.location,
        image: data.image?.[0] || "",
        province: data.province || "",
        gymDescription: data.description || "",
        openHours: Object.entries(data.openHours || {})
          .map(([day, time]) => `${day}: ${time}`)
          .join("\n"),
      };
      gyms.push(gymData);
    });

    // Filtering (if query exists)
    if (gymId) gyms = gyms.filter((g) => g.gymId === gymId);
    if (province) gyms = gyms.filter((g) => g.province?.toLowerCase() === province.toLowerCase());
    if (name) {
      gyms = gyms.filter(
        (g) => g.name?.trim().toLowerCase() === name.trim().toLowerCase()
      );
      console.log("🧪 name from query:", name);

    }
    

    return res.status(200).json(gyms);
  } catch (error) {
    console.error("Error getting gyms:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
