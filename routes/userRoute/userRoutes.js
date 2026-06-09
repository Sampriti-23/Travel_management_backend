const express = require("express");
const router = express.Router();
const usercontroller = require("../../controller/userController/userController");

// Create user
router.post("/user", usercontroller.getuser);

// Get all users
router.get("/getalluser", usercontroller.getalluser);

// Get user by ID
router.get("/user/:id", usercontroller.getbyid);

module.exports = router;