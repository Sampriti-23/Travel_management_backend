const express = require("express");
const router = express.Router();

const {
  createLocation,
  getLocations,
  getLocationsByDestination,
  updateLocation,
  deleteLocation
} = require("../../controller/locationController/locationController");

router.post("/create", createLocation);

router.get("/", getLocations);

router.get(
  "/destination/:destinationId",
  getLocationsByDestination
);

router.put("/:id", updateLocation);

router.delete("/:id", deleteLocation);

module.exports = router;