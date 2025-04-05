import express from "express";
const router = express.Router(); 
import cors from "cors";

const app = express();
app.use(cors());

import { uploadJSON } from "../controllers/uploaddb.js";
import { getData } from "../controllers/getdb.js";
import { getFilteredGyms } from "../controllers/filterGyms.js";
import { getGymClasses } from "../controllers/getdbcclass.js";
import { getDataAdmin } from "../controllers/testadmin.js";
import { createGym } from "../controllers/createGym.js";  
import { deleteGym } from "../controllers/deleteGym.js"; 
import { updateGym } from "../controllers/updateGym.js";  
import { saveUser } from "../controllers/saveUser.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";

//------ Gyms --------
router.post("/upload", uploadJSON);
router.get("/data", getData);        // API ดึงข้อมูลจาก Firestore --gymId,name,loca
router.get("/filtergym",getFilteredGyms); //Name+Location on Home Page (10 destination)
router.get("/classes",getGymClasses); 

// ------ Admin --------
router.get("/gymadmin", getDataAdmin);   
// Create, Update, Delete for Gyms
router.post("/gym", createGym);  // POST for creating gym
router.delete("/gym/:gymId", deleteGym); // DELETE for deleting gym by gymId
router.put("/gym/:gymId", updateGym);  // PUT for updating gym by gymId

//------- User ------------
router.post("/save-user", verifyFirebaseToken, saveUser); 

// router.get("/gymadmin", authMiddleware, getDataAdmin);  // Admin เท่านั้นที่สามารถเข้าถึงได้ --gymId,name,loca
// router.post("/gym", authMiddleware, createGym);  // ต้องล็อกอินเพื่อสร้างค่ายมวย
// router.delete("/gym/:gymId", authMiddleware, deleteGym); // ต้องล็อกอินเพื่อลบค่ายมวย
// router.put("/gym/:gymId", authMiddleware, updateGym);  // ต้องล็อกอินเพื่ออัปเดตข้อมูลค่ายมวย
  
export default router;
