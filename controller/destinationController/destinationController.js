const Destination = require("../../models/Destination");

/* ========================
   CREATE DESTINATION
======================== */
exports.createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      message: "Destination created successfully",
      data: destination,
      status_code: 201
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

/* ========================
   GET ALL DESTINATIONS
======================== */
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find()
      .populate("locations", "name")
      .lean();

    res.status(200).json({
      message: "Destinations fetched successfully",
      data: destinations,
      status_code: 200
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/* ========================
   GET DESTINATION BY ID
======================== */
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate("locations", "name");

    if (!destination) {
      return res.status(404).json({
        error: "Destination not found"
      });
    }

    res.status(200).json({
      message: "Destination fetched successfully",
      data: destination,
      status_code: 200
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/* ========================
   UPDATE DESTINATION
======================== */
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({
        error: "Destination not found"
      });
    }

    res.status(200).json({
      message: "Destination updated successfully",
      data: destination,
      status_code: 200
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

/* ========================
   DELETE DESTINATION
======================== */
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        error: "Destination not found"
      });
    }

    res.status(200).json({
      message: "Destination deleted successfully",
      status_code: 200
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};