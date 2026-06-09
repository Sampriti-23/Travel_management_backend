const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },

  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },

  description: String,

  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  }],

  amenities: [String],

  image: {
  type: String,
  default: ""
}
});

module.exports = mongoose.model("Hotel", hotelSchema);