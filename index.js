const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoute/userRoutes");
const hotelRoute = require("./routes/hotelRoutes/hotelRoute");
const roomRoute = require("./routes/roomRoutes/roomRoute");
const tourpackageRoute = require("./routes/tourpackageRoutes/tourpackageRoutes");
const authRoute = require("./routes/authRoutes/authRoutes");
const destinationRoute = require("./routes/destinationRoute/destinationRoute");
const locationRoute = require("./routes/locationRoute/locationRoute");
const carRoute = require("./routes/carRoute/carRoute");
const path = require('path');
// const registrationRoute = require("./routes/registrationRoute/registrationRoute");
const mongoose = require("mongoose");
const cors= require("cors");
// const bookingRoute = require("./routes/bookingRoutes/bookingRoute");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use("/api/user", userRoutes);
app.use("/api/hotel", hotelRoute);
app.use("/api/room", roomRoute);
app.use("/api/tourpackage",tourpackageRoute);
app.use("/api/auth",authRoute);
app.use("/api/destination",destinationRoute);
app.use("/api/location",locationRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/car", require("./routes/carRoute/carRoute"));
// app.use("/api/registration",registrationRoute);   
//app.use("/api",bookingRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
