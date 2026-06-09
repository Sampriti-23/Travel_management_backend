const express = require("express");
const router = express.Router();
const tourpackageController = require("../../controller/tourpackageController/tourpackageController");
const upload = require("../../middleware/uploads");

router.post("/create", upload.single("image"), tourpackageController.createTourPackage);
router.get("/getall", tourpackageController.getAllTourPackages);
router.get("/getbyid/:id", tourpackageController.getTourPackageById);
router.put("/update/:id", upload.single("image"), tourpackageController.updateTourPackage);
router.delete("/delete/:id", tourpackageController.deleteTourPackage);

module.exports = router;