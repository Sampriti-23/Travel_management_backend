const Booking = require("../../models/Booking");
const TourPackage = require("../../models/TourPackage");

/* ========================
   CREATE BOOKING
======================== */

exports.createBooking = async (req, res) => {
  try {
    const bookingData = { ...req.body };

    // 1. If it's a tour booking, deduct from available slots
    if (bookingData.type === "tour" && bookingData.tourPackage) {
      const tour = await TourPackage.findById(bookingData.tourPackage);
      if (!tour) {
        return res.status(404).json({ message: "Tour package not found" });
      }
      
      const seatsRequested = Number(bookingData.numOfPeople) || 1;
      if (tour.availableSlots < seatsRequested) {
        return res.status(400).json({ message: `Only ${tour.availableSlots} slots available for this tour.` });
      }

      // Deduct slots
      tour.availableSlots -= seatsRequested;
      await tour.save();
    }

    const booking = await Booking.create(bookingData);

    // Populate user and generic references for response return
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("hotel", "name")
      .populate("room", "roomType")
      .populate("tourPackage", "title")
      .populate("car", "name carnumber");

    res.status(201).json({
      message: "Booking initiated successfully",
      data: populatedBooking,
      status_code: 201
    });

  } catch (err) {
    res.status(400).json({
      message: "Error creating booking",
      error: err.message
    });
  }
};

/* ========================
   GET ALL BOOKINGS (Admin View)
======================== */
exports.getAllBookings = async (req, res) => {
  try {
    // Fetches all bookings across hotels, cars, and tours
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("hotel", "name location")
      .populate("room", "roomType pricePerNight")
      .populate("tourPackage", "title pricePerPerson")
      .populate("car", "name carnumber price")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: "All bookings fetched successfully",
      data: bookings,
      status_code: 200
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching bookings",
      error: err.message
    });
  }
};

/* ========================
   GET SINGLE BOOKING DETAILS
======================== */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("hotel", "name description")
      .populate("room", "roomType capacity")
      .populate("tourPackage", "title durationDays includes")
      .populate("car", "name type carnumber")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking record not found" });
    }

    res.status(200).json({
      message: "Booking retrieved successfully",
      data: booking,
      status_code: 200
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving booking records",
      error: err.message
    });
  }
};

/* ========================
   UPDATE BOOKING STATUS (Confirm / Cancel)
======================== */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const oldBooking = await Booking.findById(req.params.id);

    if (!oldBooking) {
      return res.status(404).json({ message: "Booking record not found" });
    }

    // 🔄 INVENTORY CORRECTION: If booking is cancelled, restore slots
    if (status === "cancelled" && oldBooking.status !== "cancelled" && oldBooking.type === "tour") {
      const seatsToRestore = oldBooking.numOfPeople || 1;
      await TourPackage.findByIdAndUpdate(oldBooking.tourPackage, {
        $inc: { availableSlots: seatsToRestore }
      });
    }
    
    // 🔄 INVENTORY CORRECTION: If a cancelled booking is re-confirmed
    if (status === "confirmed" && oldBooking.status === "cancelled" && oldBooking.type === "tour") {
      const seatsToDeduct = oldBooking.numOfPeople || 1;
      await TourPackage.findByIdAndUpdate(oldBooking.tourPackage, {
        $inc: { availableSlots: -seatsToDeduct }
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("user", "name email")
      .populate("hotel", "name")
      .populate("room", "roomType")
      .populate("tourPackage", "title")
      .populate("car", "name carnumber");

    res.status(200).json({
      message: `Booking status updated to ${status}`,
      data: updatedBooking,
      status_code: 200
    });

  } catch (err) {
    res.status(400).json({
      message: "Error updating status",
      error: err.message
    });
  }
};

/* ========================
   DELETE BOOKING
======================== */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // If an active tour booking gets permanently deleted, release back the tickets
    if (booking.status !== "cancelled" && booking.type === "tour") {
      const seatsToRestore = booking.numOfPeople || 1;
      await TourPackage.findByIdAndUpdate(booking.tourPackage, {
        $inc: { availableSlots: seatsToRestore }
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      message: "Booking deleted successfully",
      status_code: 200
    });
  } catch (err) {
    res.status(400).json({
      message: "Error deleting booking documentation",
      error: err.message
    });
  }
};