import admin from "firebase-admin";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    console.log("✅ Firebase token verified");
    console.log("👉 UID:", decodedToken.uid);
    console.log("👉 Email:", decodedToken.email);
    req.user = decodedToken;
    
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
