import express from "express";
const router = express.Router(); 
import cors from "cors";

const app = express();
app.use(cors());

import { getData } from "../controllers/front/getdb.js";
import { getFilteredGyms } from "../controllers/front/filterGyms.js";
import { getGymClasses } from "../controllers/front/getdbcclass.js";
import { getAttractions } from "../controllers/front/attraction.js";
import { getFoodPlaces } from "../controllers/front/food.js";
import { getAccommodations } from "../controllers/front/accommodation.js";
import { getGyms } from "../controllers/front/getGym.js";
import { getGymsWithClasses } from "../controllers/front/gymWithClasses.js";



//------ Gyms --------
router.get("/data", getData);        //gymId,name,loca  lat long  for search
router.get("/filtergym",getFilteredGyms); //Name+Location on Home Page (10 destination)
router.get("/gym", getGyms); //gym detail

//------Classes---------
router.get("/gym/classes",getGymClasses); //คลาสสอนของค่ายมวย
//------Category----------
router.get("/attractions", getAttractions); //กิจกรรม แสดงทั้งหมด ตามไอดี และ type ได้
router.get("/food", getFoodPlaces); // อาหารแสดงทั้งหมด ตามไอดี และ type ได้
router.get("/accommodation", getAccommodations); //ที่พักแสดงทั้งหมด ตามไอดี และ type ได้

//------GymWithClasses-------
router.get("/gymclasses",getGymsWithClasses);

export default router;
