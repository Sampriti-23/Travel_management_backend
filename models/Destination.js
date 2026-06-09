const mongoose =require ("mongoose");

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  locations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
}
);

module.exports = mongoose.model('Destination', destinationSchema);