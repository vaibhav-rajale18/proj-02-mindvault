const Entry = require("../models/Entry");

const createEntry = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const entry = await Entry.create({
      userId: req.user,
      title,
      content,
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user }).sort({
      createdAt: -1,
    });

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    if (entry.userId.toString() !== req.user) {
      return res.status(403).json({
        message: "Not authorized to delete this entry",
      });
    }

    await entry.deleteOne();

    res.status(200).json({
      message: "Entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    if (entry.userId.toString() !== req.user) {
      return res.status(403).json({
        message: "Not authorized to view this entry",
      });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    if (entry.userId.toString() !== req.user) {
      return res.status(403).json({
        message: "Not authorized to update this entry",
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    entry.title = title;
    entry.content = content;
    await entry.save();

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const searchEntries = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const keyword = new RegExp(q, "i");

    const entries = await Entry.find({
      userId: req.user,
      $or: [{ title: keyword }, { content: keyword }],
    }).sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createEntry,
  getEntries,
  deleteEntry,
  getEntry,
  updateEntry,
  searchEntries,
};
