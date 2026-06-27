const TourPackage = require("../../models/TourPackage");
const Destination = require("../../models/Destination");
const Location = require("../../models/Location");
const Car = require("../../models/Car");

/* ========================
   CREATE TOUR PACKAGE
======================== */
exports.createTourPackage = async (req, res) => {
  try {
    const packageData = { ...req.body };

    // 1. Parse Location Array from FormData string
    if (req.body.location) {
      if (typeof req.body.location === "string") {
        // If sent as stringified JSON array "[id1, id2]", or raw comma-separated ids "id1,id2"
        if (req.body.location.startsWith("[")) {
          packageData.location = JSON.parse(req.body.location);
        } else {
          packageData.location = req.body.location
  .split(",")
  .map(id => id.trim());
        }
      }
    } else {
      packageData.location = [];
    }

    // 2. Parse Includes Array ("Breakfast, Guide, Transport" -> ["Breakfast", "Guide", "Transport"])
    if (req.body.includes) {
      if (typeof req.body.includes === "string") {
        packageData.includes = req.body.includes.split(",").map(item => item.trim());
      }
    } else {
      packageData.includes = [];
    }

    // 3. Attach File Upload via Multer
    if (req.file) {
      packageData.image = `/uploads/${req.file.filename}`;
    }

    // Clean up empty strings for destination to avoid casting errors
    if (packageData.destination === "") delete packageData.destination;

    const tourPackage = await TourPackage.create(packageData);

    const populatedPackage = await TourPackage.findById(tourPackage._id)
      .populate("destination", "name")
      .populate("location", "name");

    res.status(201).json({
      message: "Tour package created successfully",
      data: populatedPackage,
      status_code: 201,
    });
  } catch (err) {
    console.error("❌ CREATE TOUR PACKAGE ERROR:", err.message);
    res.status(400).json({
      message: "Error creating tour package",
      error: err.message,
    });
  }
};

/* ========================
   GET ALL TOUR PACKAGES
======================== */
exports.getAllTourPackages = async (req, res) => {
  try {
    const packages = await TourPackage.find()
      .populate("destination", "name")
      .populate("location", "name")
      .lean();

    res.status(200).json({
      message: "Tour packages fetched successfully",
      data: packages,
      status_code: 200,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching tour packages",
      error: err.message,
    });
  }
};

exports.searchPackage = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      const packages = await TourPackage.find()
        .populate("destination", "name")
        .populate("location", "name");

      return res.status(200).json({
        message: "Packages fetched successfully",
        data: packages,
        status_code: 200,
      });
    }

    const destinations = await Destination.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

    const destinationIds = destinations.map((item) => item._id);

    const packages = await TourPackage.find({
      destination: {
        $in: destinationIds,
      },
    })
      .populate("destination", "name")
      .populate("location", "name");

    res.status(200).json({
      message: "Packages fetched successfully",
      data: packages,
      status_code: 200,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

/* ========================
   GET SINGLE TOUR PACKAGE BY ID
======================== */
exports.getTourPackageById = async (req, res) => {
  try {
    const tourPackage = await TourPackage.findById(req.params.id)
      .populate("destination", "name")
      .populate("location", "name")
      .lean();

    if (!tourPackage) {
      return res.status(404).json({
        message: "Tour package not found",
      });
    }

    res.status(200).json({
      message: "Tour package fetched successfully",
      data: tourPackage,
      status_code: 200,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching tour package",
      error: err.message,
    });
  }
};

/* ========================
   UPDATE TOUR PACKAGE
======================== */
exports.updateTourPackage = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // 1. Reparse Location Array
    if (req.body.location) {
      if (typeof req.body.location === "string") {
        if (req.body.location.startsWith("[")) {
          updateData.location = JSON.parse(req.body.location);
        } else {
          updateData.location = req.body.location.split(",").map(id => id.trim());
        }
      }
    }

    // 2. Reparse Includes Array
    if (req.body.includes) {
      if (typeof req.body.includes === "string") {
        updateData.includes = req.body.includes.split(",").map(item => item.trim());
      }
    }

    // 3. Process new replacement image if uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPackage = await TourPackage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("destination", "name")
      .populate("location", "name");

    if (!updatedPackage) {
      return res.status(404).json({
        message: "Tour package not found",
      });
    }

    res.status(200).json({
      message: "Tour package updated successfully",
      data: updatedPackage,
      status_code: 200,
    });
  } catch (err) {
    console.error("❌ UPDATE TOUR PACKAGE ERROR:", err.message);
    res.status(400).json({
      message: "Error updating tour package",
      error: err.message,
    });
  }
};

/* ========================
   DELETE TOUR PACKAGE
======================== */
exports.deleteTourPackage = async (req, res) => {
  try {
    const tourPackage = await TourPackage.findByIdAndDelete(req.params.id);

    if (!tourPackage) {
      return res.status(404).json({
        message: "Tour package not found",
      });
    }

    res.status(200).json({
      message: "Tour package deleted successfully",
      status_code: 200,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error deleting tour package",
      error: err.message,
    });
  }
};