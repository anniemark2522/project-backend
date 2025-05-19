export const getTripById = async (req, res) => {
    const { tripId } = req.params;
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
  
      const doc = await admin.firestore().collection("users").doc(uid).collection("trips").doc(tripId).get();
      if (!doc.exists) return res.status(404).json({ error: "Trip not found" });
  
      return res.status(200).json(doc.data());
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  