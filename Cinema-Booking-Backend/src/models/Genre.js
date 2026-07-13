const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

genreSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Genre", genreSchema);
