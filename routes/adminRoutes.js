import express from "express";
import { getGymsAdmin } from "../controllers/admin/getGymAdmin.js";
import { deleteGymAdmin } from "../controllers/admin/deleteGymAdmin.js";
import { getGymClassesAdmin } from "../controllers/admin/getGymClassesAdmin.js";
import { saveUser } from "../controllers/saveUser.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { updateGymAdmin } from "../controllers/admin/updategymAdmin.js"
import {
    deleteGymClass,
    addGymClass,
    updateGymClass,
  } from "../controllers/admin/gymClassAdmin.js";

const router = express.Router();

router.get("/admin/gyms", getGymsAdmin);
router.delete("admin/gyms/:gymId", deleteGymAdmin);
router.put("/admin/gyms/:gymId", updateGymAdmin);
//------ Classes --------------
router.get("/admin/gyms/classes", getGymClassesAdmin);
router.delete("/admin/gyms/:gymId/classes/:index", deleteGymClass);
router.post("/admin/gyms/:gymId/classes", addGymClass);
router.patch("/admin/gyms/:gymId/classes/:index", updateGymClass);

//------- User ------------
router.post("/save-user", verifyFirebaseToken, saveUser); 

export default router;
