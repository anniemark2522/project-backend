import admin from "firebase-admin";

export const userProfile = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(userDoc.data());
  } catch (err) {
    console.error("❌ Error fetching user profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
