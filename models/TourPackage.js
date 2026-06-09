const mongoose = require("mongoose");

const tourPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
  location: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    }],
    car:{ type: mongoose.Schema.Types.ObjectId, ref: "Car" ,required: true},
  durationDays: Number,
  pricePerPerson: Number,
  startDate: Date,
  endDate: Date,
  image: {
  type: String,
  default: ""
},
  includes: [String],
  availableSlots: { type: Number, default: 20 }
});

module.exports = mongoose.model("TourPackage", tourPackageSchema);