const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true
  },
  roomType: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: {
  type: String,
  default: ""
}
});

module.exports = mongoose.model("Room", roomSchema);