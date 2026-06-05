const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Make createdAt explicitly immutable to prevent accidental overwrite
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
