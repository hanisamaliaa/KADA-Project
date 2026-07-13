const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  genre: {
    type: String,
    required: true,
    trim: true,
  },

  duration: {
    type: Number,
    required: true,
    min: [1, "Duration must be greater than 0"],
  },

  rating: {
    type: String,
    required: true,
    trim: true,
  },

  poster: {
    type: String,
    required: true,
  },

  trailerUrl: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Movie", movieSchema);
