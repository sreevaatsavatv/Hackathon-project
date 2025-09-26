// Update session status (mentor action)
exports.updateSessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, time } = req.body;
    const update = { status };
    if (status === "Rescheduled" && time) {
      update.time = time;
    }
    const session = await Session.findByIdAndUpdate(id, update, { new: true });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const Session = require("../models/Session");

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { student, topic, date, time } = req.body;
    if (!student || !topic || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const session = new Session({ student, topic, date, time });
    await session.save();
    res.status(201).json({ session });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get sessions for a student or all sessions for mentors
exports.getSessions = async (req, res) => {
  try {
    const { student } = req.query;
    let sessions;
    if (student) {
      sessions = await Session.find({ student });
    } else {
      sessions = await Session.find(); // return all sessions if no student param
    }
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
