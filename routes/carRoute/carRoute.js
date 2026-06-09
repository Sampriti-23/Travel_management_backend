const express = require("express");
const router = express.Router();
const carController = require("../../controller/carController/carController");
const upload = require("../../middleware/uploads"); // Imports your multer instance

/* ========================
   ROUTES MAP
======================== */
router.post("/createcar", upload.single("image"), carController.createCar);
router.get("/getcar", carController.getAllCars);
router.get("/getcar/:id", carController.getCarById);
router.put("/updatecar/:id", upload.single("image"), carController.updateCar);
router.delete("/deletecar/:id", carController.deleteCar);

module.exports = router;