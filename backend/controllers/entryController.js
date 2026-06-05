const Entry = require("../models/Entry");

const moodOptions = [
  "happy",
  "sad",
  "frustrated",
  "calm",
  "motivated",
  "tired",
  "thoughtful",
];

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => String(tag || "").trim())
    .map((tag) => {
      const cleaned = tag.replace(/^[#]+/, "").replace(/[^a-zA-Z0-9-_]/g, "");
      return cleaned ? `#${cleaned}` : "";
    })
    .filter(Boolean)
    .filter((tag, index, arr) => arr.indexOf(tag.toLowerCase()) === index);
};

const createEntry = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    if (mood && !moodOptions.includes(mood)) {
      return res.status(400).json({
        message: "Invalid mood selected",
      });
    }

    const entry = await Entry.create({
      userId: req.user,
      title,
      content,
      mood: mood || "thoughtful",
      tags: normalizeTags(tags),
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

    // Only accept title, content, mood, and tags for edits. Ignore createdAt if provided.
    const { title, content, mood, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    if (mood && !moodOptions.includes(mood)) {
      return res.status(400).json({
        message: "Invalid mood selected",
      });
    }

    entry.title = title;
    entry.content = content;
    entry.mood = mood || entry.mood || "thoughtful";
    entry.tags = normalizeTags(tags);
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

    // Build base filters
    const baseFilter = { userId: req.user };

    // Try to interpret the query as a date or partial date
    const now = new Date();
    let dateFilter = null;

    const tryParseDateRange = (input) => {
      // ISO full date YYYY-MM-DD
      const isoDay = /^\d{4}-\d{2}-\d{2}$/;
      const isoMonth = /^\d{4}-\d{2}$/;
      const yearOnly = /^\d{4}$/;

      if (isoDay.test(input)) {
        const start = new Date(input + "T00:00:00.000Z");
        const end = new Date(input + "T23:59:59.999Z");
        return { start, end };
      }

      if (isoMonth.test(input)) {
        const [y, m] = input.split("-");
        const start = new Date(Date.UTC(Number(y), Number(m) - 1, 1, 0, 0, 0));
        const end = new Date(
          Date.UTC(Number(y), Number(m), 0, 23, 59, 59, 999),
        );
        return { start, end };
      }

      if (yearOnly.test(input)) {
        const y = Number(input);
        const start = new Date(Date.UTC(y, 0, 1, 0, 0, 0));
        const end = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));
        return { start, end };
      }

      // Try natural language parse
      let parsed = new Date(input);
      if (!isNaN(parsed.getTime())) {
        // treat as that exact day
        const year = parsed.getUTCFullYear();
        const month = parsed.getUTCMonth();
        const day = parsed.getUTCDate();
        const start = new Date(Date.UTC(year, month, day, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
        return { start, end };
      }

      // Try appending current year for partial dates like "May 21"
      parsed = new Date(input + " " + now.getUTCFullYear());
      if (!isNaN(parsed.getTime())) {
        const year = parsed.getUTCFullYear();
        const month = parsed.getUTCMonth();
        const day = parsed.getUTCDate();
        const start = new Date(Date.UTC(year, month, day, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
        return { start, end };
      }

      return null;
    };

    dateFilter = tryParseDateRange(q.trim());

    const orClauses = [
      { title: keyword },
      { content: keyword },
      { mood: keyword },
      { tags: keyword },
    ];

    if (dateFilter) {
      orClauses.push({
        createdAt: { $gte: dateFilter.start, $lte: dateFilter.end },
      });
    }

    const entries = await Entry.find({
      ...baseFilter,
      $or: orClauses,
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
