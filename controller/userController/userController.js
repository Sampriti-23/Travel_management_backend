const User = require("../../models/User");

// Create user
exports.getuser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users
exports.getalluser = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).lean();
    res.json({data:users,status_code:200});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by Id
exports.getbyid = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
