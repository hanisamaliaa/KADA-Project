const Booking = require("../models/Booking");
const Movie = require("../models/Movie");
const Showtime = require("../models/Showtime");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/stats — dashboard statistics (§7.1, §9.5)
const getStats = asyncHandler(async (req, res) => {
  const [totalMovies, totalShowtimes, totalBookings, totalUsers] = await Promise.all([
    Movie.countDocuments(),
    Showtime.countDocuments(),
    Booking.countDocuments(),
    User.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: { totalMovies, totalShowtimes, totalBookings, totalUsers },
  });
});

// GET /api/admin/bookings — all bookings for monitoring (§7.4, §9.4)
// Optional query: ?page=&limit=
const getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [bookings, totalItems] = await Promise.all([
    Booking.find()
      .populate("userId", "name email") // who (no password)
      .populate("movieId", "title") // which movie
      .populate("showtimeId", "date time studio price") // which schedule
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: bookings,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  });
});

module.exports = { getStats, getAllBookings };
