const Car = require("../../models/Car");

/* ========================
   CREATE CAR
======================== */
exports.createCar = async (req, res) => {
  try {
    const carData = { ...req.body };

    // Attach file upload path via Multer
    if (req.file) {
      carData.image = `/uploads/${req.file.filename}`;
    }

    const car = await Car.create(carData);

    res.status(201).json({
      message: "Car created successfully",
      data: car,
      status_code: 201,
    });
  } catch (err) {
    console.error("❌ CREATE CAR ERROR:", err.message);
    res.status(400).json({
      message: "Error creating car",
      error: err.message,
    });
  }
};

/* ========================
   GET ALL CARS
======================== */
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().lean();

    res.status(200).json({
      message: "Cars fetched successfully",
      data: cars,
      status_code: 200,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching cars",
      error: err.message,
    });
  }
};

exports.searchCar =async (req,res)=> {
  try{

    const{source,destination,seat} = req.query;

    let filter={};
    
    if(source){
      filter.source ={
        $regex: source,
        $options : 'i'
      };
    }

    if(destination){
      filter.destination ={
        $regex: destination,
        $options : 'i'
      };
    }

    if(seat){
      filter.seat={
        $gte : Number(seat)
      };
    }
    const cars = await Car.find(filter)
res.status(200).json({
      message: "Cars fetched successfully",
      data: cars,
      status_code: 200,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ========================
   GET SINGLE CAR BY ID
======================== */
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).lean();

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.status(200).json({
      message: "Car fetched successfully",
      data: car,
      status_code: 200,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching car",
      error: err.message,
    });
  }
};

/* ========================
   UPDATE CAR
======================== */
exports.updateCar = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Process new replacement image if uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.status(200).json({
      message: "Car updated successfully",
      data: updatedCar,
      status_code: 200,
    });
  } catch (err) {
    console.error("❌ UPDATE CAR ERROR:", err.message);
    res.status(400).json({
      message: "Error updating car",
      error: err.message,
    });
  }
};

/* ========================
   DELETE CAR
======================== */
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.status(200).json({
      message: "Car deleted successfully",
      status_code: 200,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error deleting car",
      error: err.message,
    });
  }
};