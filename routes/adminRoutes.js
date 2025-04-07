import express from "express";
import { getGymsAdmin } from "../controllers/admin/getGymAdmin.js";
import { deleteGymAdmin } from "../controllers/admin/deleteGymAdmin.js";
import { getGymClassesAdmin } from "../controllers/admin/getGymClassesAdmin.js";
import { saveUser } from "../controllers/saveUser.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";

const router = express.Router();

router.get("/admin/gyms", getGymsAdmin);
router.delete("admin/gyms/:gymId", deleteGymAdmin);
router.get("/admin/gyms/classes", getGymClassesAdmin);

//------- User ------------
router.post("/save-user", verifyFirebaseToken, saveUser); 

export default router;
