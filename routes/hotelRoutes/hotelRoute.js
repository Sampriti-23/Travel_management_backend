const express = require("express");
const router = express.Router();

const hotelcontroller = require("../../controller/hotelController/hotelController");
const upload = require("../../middleware/uploads"); // adjust path if needed

/* ========================
   CREATE HOTEL
======================== */
router.post(
  "/createhotel",
  upload.single("image"),
  hotelcontroller.createhotel
);

/* ========================
   GET ALL HOTELS
======================== */
router.get(
  "/gethotel",
  hotelcontroller.gethotel
);

/* ========================
   GET HOTEL BY ID
======================== */
router.get(
  "/gethotelbyid/:id",
  hotelcontroller.gethotelbyid
);

/* ========================
   UPDATE HOTEL
======================== */
router.put(
  "/updatehotel/:id",
  upload.single("image"),
  hotelcontroller.updatehotel
);

/* ========================
   DELETE HOTEL
======================== */
router.delete(
  "/deletehotel/:id",
  hotelcontroller.deletehotel
);

module.exports = router;