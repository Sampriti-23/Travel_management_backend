const Room = require("../../models/Room");
const Hotel = require("../../models/Hotel");

/* ========================
   CREATE ROOM
======================== */
exports.createroom = async (req, res) => {
  try {
    const roomData = { ...req.body };

    // ✅ Attach image path BEFORE creating the document instance
    if (req.file) {
      roomData.image = `/uploads/${req.file.filename}`;
    }

    const room = await Room.create(roomData);

    // Add room ID link to the parent Hotel reference array
    await Hotel.findByIdAndUpdate(room.hotel, {
      $push: { rooms: room._id }
    });

    const populatedRoom = await Room.findById(room._id)
      .populate("hotel", "name location");

    res.status(201).json({
      message: "Room created successfully",
      data: populatedRoom,
      status_code: 201
    });

  } catch (err) {
    res.status(400).json({
      message: "Error creating room",
      error: err.message
    });
  }
};

/* ========================
   GET ALL ROOMS
======================== */
exports.getroom = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("hotel", "name location")
      .lean();

    res.status(200).json({
      message: "Rooms fetched successfully",
      data: rooms,
      status_code: 200
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching rooms",
      error: err.message
    });
  }
};

/* ========================
   GET ROOM BY ID
======================== */
exports.getroombyid = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("hotel", "name location")
      .lean();

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({
      message: "Room fetched successfully",
      data: room,
      status_code: 200
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching room",
      error: err.message
    });
  }
};

/* ========================
   UPDATE ROOM
======================== */
exports.updateroom = async (req, res) => {
  try {
    const oldRoom = await Room.findById(req.params.id);

    if (!oldRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    const updateData = { ...req.body };

    // ✅ Attach updated image file path if a new file is sent
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("hotel", "name location");

    // Manage tracking updates if room shifts parents
    if (req.body.hotel && oldRoom.hotel.toString() !== req.body.hotel) {
      // Remove from old hotel
      await Hotel.findByIdAndUpdate(oldRoom.hotel, {
        $pull: { rooms: oldRoom._id }
      });

      // Add to new hotel
      await Hotel.findByIdAndUpdate(req.body.hotel, {
        $push: { rooms: oldRoom._id }
      });
    }

    res.status(200).json({
      message: "Room updated successfully",
      data: updatedRoom,
      status_code: 200
    });

  } catch (err) {
    res.status(400).json({
      message: "Error updating room",
      error: err.message
    });
  }
};

/* ========================
   DELETE ROOM
======================== */
exports.deleteroom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Remove room ID out of parent Hotel arrays
    if (room.hotel) {
      await Hotel.findByIdAndUpdate(room.hotel, {
        $pull: { rooms: room._id }
      });
    }

    res.status(200).json({
      message: "Room deleted successfully",
      status_code: 200
    });

  } catch (err) {
    res.status(400).json({
      message: "Error deleting room",
      error: err.message
    });
  }
};