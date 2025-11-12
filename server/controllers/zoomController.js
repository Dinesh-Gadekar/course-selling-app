import ZoomSession from "../models/ZoomSession.js";

export const createMeeting = async (req, res) => {
  try {
    const url = `https://zoom.us/j/${Date.now().toString().slice(-9)}`;
    const session = await ZoomSession.create({ host: req.user._id, url });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMeetings = async (req, res) => {
  const meetings = await ZoomSession.find().populate("host", "name");
  res.json(meetings);
};
