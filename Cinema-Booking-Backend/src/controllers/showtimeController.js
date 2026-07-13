const Showtime = require("../models/Showtime");
const Movie = require("../models/Movie");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET /api/showtimes?movieId=&date=   (Public)
const getShowtimes = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.movieId) {
    filter.movieId = req.query.movieId;
  }

  if (req.query.date) {
    const start = new Date(req.query.date);
    if (Number.isNaN(start.getTime())) {
      throw new AppError("Invalid date query parameter. Use ISO format (YYYY-MM-DD).", 400);
    }
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.date = { $gte: start, $lt: end };
  }

  const showtimes = await Showtime.find(filter).populate("movieId");
  res.status(200).json({ success: true, data: showtimes });
});

// GET /api/showtimes/:id   (Public)
const getShowtimeDetail = asyncHandler(async (req, res) => {
  const showtime = await Showtime.findById(req.params.id).populate("movieId");
  if (!showtime) throw new AppError("Showtime not found", 404);
  res.status(200).json({ success: true, data: showtime });
});

// GET /api/showtimes/:id/seats   (Public)
const getSeats = asyncHandler(async (req, res) => {
  const showtime = await Showtime.findById(req.params.id);
  if (!showtime) throw new AppError("Showtime not found", 404);
  res.status(200).json({
    success: true,
    data: {
      bookedSeats: showtime.bookedSeats,
      layout: { rows: 8, columns: 10 },
    },
  });
});

// POST /api/showtimes   (Admin)
const createShowtime = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) throw new AppError("Movie not found", 400);
  if (req.body.price <= 0) throw new AppError("Price must be greater than 0", 400);

  const showtime = await Showtime.create(req.body);
  res.status(201).json({ success: true, data: showtime });
});

// PUT /api/showtimes/:id   (Admin)
const updateShowtime = asyncHandler(async (req, res) => {
  if (req.body.movieId) {
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) throw new AppError("Movie not found", 400);
  }
  if (req.body.price !== undefined && req.body.price <= 0) {
    throw new AppError("Price must be greater than 0", 400);
  }

  const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!showtime) throw new AppError("Showtime not found", 404);
  res.status(200).json({ success: true, data: showtime });
});

// DELETE /api/showtimes/:id   (Admin)
const deleteShowtime = asyncHandler(async (req, res) => {
  const showtime = await Showtime.findByIdAndDelete(req.params.id);
  if (!showtime) throw new AppError("Showtime not found", 404);
  res.status(200).json({ success: true, message: "Showtime deleted successfully" });
});

module.exports = {
  getShowtimes,
  getShowtimeDetail,
  getSeats,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};
