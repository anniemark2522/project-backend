import express from "express";
import { getGymsAdmin } from "../controllers/admin/gym/getGymAdmin.js";
import { deleteGymAdmin } from "../controllers/admin/gym/deleteGymAdmin.js";
import { getGymClassesAdmin } from "../controllers/admin/classes/getGymClassesAdmin.js";
import { saveUser } from "../controllers/saveUser.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { updateGymAdmin } from "../controllers/admin/gym/updategymAdmin.js"
import { deleteGymClass} from "../controllers/admin/classes/delgymClassAdmin.js";
import { addGymClass } from "../controllers/admin/classes/addgymClassAdmin.js";
import { updateGymClass } from "../controllers/admin/classes/updategymClassAdmin.js";
import { createGym } from "../controllers/admin/gym/createGym.js";
import { getAccommodations } from "../controllers/front/accommodation.js";
import { createAccommodation } from "../controllers/admin/accommodation/createAccomAdmin.js";
import { updateAccommodation } from "../controllers/admin/accommodation/updateAccomAdmin.js";
import { deleteAccommodation } from "../controllers/admin/accommodation/delAccomAdmin.js";
import { getFoodsAdmin } from "../controllers/admin/food/getFoodAdmin.js";
import { createFood } from "../controllers/admin/food/createFoodAdmin.js";
import { updateFood } from "../controllers/admin/food/updateFoodAdmin.js";
import { deleteFood } from "../controllers/admin/food/delFoodAdmin.js";
import { getAttractions } from "../controllers/front/attraction.js";
import { createAttraction } from "../controllers/admin/attraction/createAttractAdmin.js";
import { updateAttraction } from "../controllers/admin/attraction/updateAttractAdmin.js";
import { deleteAttraction } from "../controllers/admin/attraction/delAttractAdmin.js";
import { getUsers, deleteUserByAdmin } from "../controllers/admin/user/userAdmin.js";
import { updateLatLng } from "../controllers/admin/updateLatLng.js";
import { getGymLatLngById } from "../controllers/admin/getLatLong.js";


const router = express.Router();

//------- Gyms --------------
router.get("/admin/gyms", getGymsAdmin);
router.delete("/admin/gyms/:gymId", deleteGymAdmin);
router.put("/admin/gyms/:gymId", updateGymAdmin);
router.post("/admin/gyms", createGym);

//------ Classes --------------
router.get("/admin/gyms/classes", getGymClassesAdmin);
router.delete("/admin/gyms/:gymId/classes/:index", deleteGymClass);
router.post("/admin/gyms/:gymId/classes", addGymClass);
router.patch("/admin/gyms/:gymId/classes/:index", updateGymClass);

//----- Accommodation -------------
router.get("/admin/accommodation", getAccommodations);
router.post("/admin/accommodation", createAccommodation);
router.put("/admin/accommodation/:hotelId", updateAccommodation);
router.delete("/admin/accommodation/:hotelId", deleteAccommodation);

//------ food ----------
router.get("/admin/food", getFoodsAdmin);
router.post("/admin/food",createFood);
router.put("/admin/food/:foodId",updateFood);
router.delete("/admin/food/:foodId", deleteFood);

//------- Attraction -------------
router.get("/admin/attraction", getAttractions);
router.post("/admin/attraction", createAttraction);
router.put("/admin/attraction/:attId", updateAttraction);
router.delete("/admin/attraction/:attId",deleteAttraction)


//------- User ------------
router.post("/save-user", verifyFirebaseToken, saveUser); 
router.get("/admin/users", getUsers);
router.delete("/admin/users/:uid",deleteUserByAdmin);


//-------LatLong-----------
router.post("/update-latlng",updateLatLng);
router.get("/gym-latlng/:gymId", getGymLatLngById);

export default router;
