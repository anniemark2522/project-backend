// import admin from "firebase-admin";
// import { Clerk } from "@clerk/clerk-sdk-node";


// const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// export const verifyClerkToken = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;

//     if (!authorization || !authorization.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const token = authorization.split(" ")[1];

//     // ✅ ตรวจสอบ JWT จาก Clerk
//     const clerkUser = await clerk.clients.verifyToken(token);
//     if (!clerkUser) return res.status(401).json({ error: "Invalid token" });

//     // ✅ เช็คว่ามีบัญชีใน Firebase หรือยัง
//     let firebaseUser;
//     try {
//       firebaseUser = await admin.auth().getUserByEmail(clerkUser.email);
//     } catch (error) {
//       // ถ้ายังไม่มี ให้สร้าง User ใหม่ใน Firebase
//       firebaseUser = await admin.auth().createUser({
//         email: clerkUser.email,
//         uid: clerkUser.id,
//         displayName: clerkUser.firstName + " " + clerkUser.lastName,
//       });
//     }

//     req.firebaseUser = firebaseUser;
//     next();
//   } catch (error) {
//     console.error("Auth Error:", error);
//     res.status(401).json({ error: "Authentication failed" });
//   }
// };
