const Location = require("../../models/Location");
const Destination = require("../../models/Destination");

/* ========================
   CREATE LOCATION
======================== */
exports.createLocation = async (req, res) => {
  try {
    const { name, destination } = req.body;

    const location = await Location.create({
      name,
      destination
    });

    await Destination.findByIdAndUpdate(
      destination,
      {
        $push: {
          locations: location._id
        }
      }
    );

    res.status(201).json({
      message: "Location created successfully",
      data: location,
      status_code: 201
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

/* ========================
   GET ALL LOCATIONS
======================== */
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find()
      .populate("destination", "name");

    res.status(200).json({
      message: "Locations fetched successfully",
      data: locations,
      status_code: 200
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/* ========================
   GET LOCATIONS BY DESTINATION
======================== */
exports.getLocationsByDestination = async (req, res) => {
  try {
    const locations = await Location.find({
      destination: req.params.destinationId
    });

    res.status(200).json({
      message: "Locations fetched successfully",
      data: locations,
      status_code: 200
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/* ========================
   UPDATE LOCATION
======================== */
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!location) {
      return res.status(404).json({
        error: "Location not found"
      });
    }

    res.status(200).json({
      message: "Location updated successfully",
      data: location,
      status_code: 200
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

/* ========================
   DELETE LOCATION
======================== */
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        error: "Location not found"
      });
    }

    await Destination.updateMany(
      {},
      {
        $pull: {
          locations: location._id
        }
      }
    );

    res.status(200).json({
      message: "Location deleted successfully",
      status_code: 200
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};