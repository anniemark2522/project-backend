// controllers/front/saveTrip.js
import admin from "firebase-admin";

export const saveTrip = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { gymName, province, lat, lng, likedPlaces } = req.body;

    const db = admin.firestore();

    const tripData = {
      gymName,
      province,
      lat,
      lng,
      likedPlaces,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(uid).collection("trips").add(tripData);

    return res.status(200).json({ message: "Trip saved successfully" });
  } catch (error) {
    console.error("❌ Error saving trip:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
