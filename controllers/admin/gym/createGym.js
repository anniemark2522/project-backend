import db from "../../../config/firebase.js";
import fetch from "node-fetch";

export const createGym = async (req, res) => {
  try {
    const {
      name,
      url,
      description,
      openHours,
      location,
      image,
      province,
    } = req.body;

    if (!name || !location || !province) {
      return res.status(400).json({ message: "Name, location, and province are required" });
    }

    const snapshot = await db.collection("detailGym").get();
    const ids = snapshot.docs
      .map((doc) => parseInt(doc.id))
      .filter((n) => !isNaN(n));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    const gymId = String(nextId);

    const newGymData = {
      gymId,
      name,
      url: url || "",
      description: description || "",
      openHours: openHours || {},
      location,
      image: image || [],
      province: province || "",
    };

    await db.collection("detailGym").doc(gymId).set(newGymData);

    const mapboxToken = process.env.MAPBOX_TOKEN;
    const fullAddress = `${name} ${province}`;
    const geoRes = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        fullAddress
      )}.json?access_token=${mapboxToken}`
    );
    const geoData = await geoRes.json();

    if (geoData?.features?.[0]) {
      const [lng, lat] = geoData.features[0].center;

      const gymLocationData = {
        gymId,
        name,
        location,
        province: province.toLowerCase(),
        lat: lat.toString(),
        long: lng.toString(),
        url: url || "",
      };

      await db.collection("GymsLatLong").doc(gymId).set(gymLocationData);
    } else {
      console.warn(" Geocoding failed: Cannot find coordinates.");
    }

    return res.status(201).json({
      message: "Gym created successfully",
      gymId,
      data: newGymData,
    });
  } catch (error) {
    console.error("Error creating gym:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
