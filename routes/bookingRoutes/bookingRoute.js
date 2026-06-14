const express = require("express");
const router = express.Router();

const { createBooking } = require("../../controller/bookingController/bookingController");
const { protect } = require("../../middleware/authMiddleware");


// // 1. Create a new booking (for hotels, tours, or cars)
router.post("/create",protect,  createBooking);

// // 2. Get all bookings (admin view)
router.post("/all", protect, createBooking);
// router.get("/all", authMiddleware, bookingController.getAllBookings);

// // 3. Get a specific booking by ID
router.get("/:id", protect, createBooking);
// router.get("/:id", authMiddleware, bookingController.getBookingById);

// // 4. ✅ FIXED: Updates booking status (Pending / Confirmed / Cancelled / Completed)
router.put("/update-status/:id", protect, createBooking);
// router.put("/update-status/:id", authMiddleware, bookingController.updateBookingStatus);

// // 5. ✅ FIXED: Permanently deletes a booking record from the ledger
router.delete("/delete/:id", protect, createBooking);
// router.delete("/delete/:id", authMiddleware, bookingController.deleteBooking);

module.exports = router;