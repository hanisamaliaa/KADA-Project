const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  studio: {
    type: String,
  },

  description: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Showtime", showtimeSchema);
