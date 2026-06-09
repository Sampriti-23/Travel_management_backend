const express = require("express");
const router = express.Router();

const {
  createDestination,
  getDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination
} = require("../../controller/destinationController/destinationController");

router.post("/create", createDestination);
router.get("/", getDestinations);
router.get("/:id", getDestinationById);
router.put("/:id", updateDestination);
router.delete("/:id", deleteDestination);

module.exports = router;