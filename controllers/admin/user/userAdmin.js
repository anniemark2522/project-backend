import admin from "firebase-admin";
import db from "../../../config/firebase.js";

export const getUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  const { uid } = req.params;
  try {
    await admin.auth().deleteUser(uid); // Remove from Firebase Auth
    await db.collection("users").doc(uid).delete(); // Remove Firestore document
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
