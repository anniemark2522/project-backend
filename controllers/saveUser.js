import admin from "firebase-admin";

export const saveUser = async (req, res) => {
    
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    // ✅ ตรวจสอบ token และดึง uid, email
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    const { firstName, lastName } = req.body;

    const db = admin.firestore();
    const userDoc = db.collection("users").doc(uid);
    const docSnapshot = await userDoc.get();

    if (!docSnapshot.exists) {
      // ✅ ยังไม่มีข้อมูล → เซฟ
      await userDoc.set({
        email,
        firstName,
        lastName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await userDoc.collection("profile").doc("info").set({
        email,
        firstName,
        lastName,
      });

      console.log("📦 User saved:", { uid, email, firstName, lastName });
    } else {
      console.log("✅ User already exists:", uid);
    }

    return res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
