const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["hotel", "package", "car"], required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  tourPackage: { type: mongoose.Schema.Types.ObjectId, ref: "TourPackage" },
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  checkIn: Date,
  checkOut: Date,
  numOfPeople: Number,
  totalAmount: Number,
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);