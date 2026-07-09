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

  time: {
    type: String,
    required: true,
  },

  studio: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  bookedSeats: {
    type: [String],
    default: [],
  },


});

module.exports = mongoose.model("Showtime", showtimeSchema);
