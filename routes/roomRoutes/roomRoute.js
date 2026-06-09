const express = require("express");
const router = express.Router();
const roomController = require("../../controller/roomController/roomController");
const upload = require("../../middleware/uploads");

// Create a new room
router.post("/createroom", upload.single("image"), roomController.createroom);

//  Get all rooms
router.get("/getroom", roomController.getroom);

//  Get room by ID
router.get("/getroom/:id", roomController.getroombyid);

//  Update room by ID
router.put("/updateroom/:id", upload.single("image"),roomController.updateroom);

//  Delete room by ID
router.delete("/deleteroom/:id", roomController.deleteroom);

module.exports = router;