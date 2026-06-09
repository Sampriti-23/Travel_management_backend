const mongoose =require("mongoose");

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    carnumber: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
    type: String,
    default: ""
    }
});

module.exports = mongoose.model("Car", carSchema);