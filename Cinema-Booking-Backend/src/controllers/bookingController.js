const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Combine date + time into a single DateTime.
const getShowtimeDateTime = (showtime) => {
  const dateTime = new Date(showtime.date);
  const [hours, minutes] = showtime.time.split(":").map(Number);
  dateTime.setHours(hours, minutes, 0, 0);
  return dateTime;
};

// POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { showtimeId, seats } = req.body;

  // STEP 1 — validate input
  if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
    throw new AppError("Showtime ID and seats are required.", 400);
  }
  const uniqueSeats = [...new Set(seats)];

  // STEP 2 — load showtime
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) throw new AppError("Showtime not found.", 404);

  // Cannot book a showtime that has already started.
  const showDateTime = getShowtimeDateTime(showtime);
  if (showDateTime < new Date()) {
    throw new AppError("Cannot book a past showtime.", 400);
  }

  // STEP 3 — price is computed on the server
  const totalPrice = showtime.price * uniqueSeats.length;

  // Atomic reserve: only succeeds if none of these seats are already booked.
  const updatedShowtime = await Showtime.findOneAndUpdate(
    { _id: showtimeId, bookedSeats: { $nin: uniqueSeats } },
    { $addToSet: { bookedSeats: { $each: uniqueSeats } } },
    { new: true }
  );

  // null → another user grabbed a seat first → conflict
  if (!updatedShowtime) {
    const fresh = await Showtime.findById(showtimeId);
    if (!fresh) throw new AppError("Showtime not found.", 404);
    const unavailable = uniqueSeats.filter((s) => fresh.bookedSeats.includes(s));
    return res.status(409).json({
      success: false,
      message: "One or more selected seats are no longer available.",
      unavailableSeats: unavailable,
    });
  }

  // STEP 4 — persist booking (seats already reserved above)
  let booking;
  try {
    booking = await Booking.create({
      userId: req.user.userId,
      movieId: showtime.movieId,
      showtimeId,
      seats: uniqueSeats,
      totalPrice,
    });
  } catch (err) {
    // rollback: release the seats we reserved so there are no "ghost" seats
    await Showtime.findByIdAndUpdate(showtimeId, {
      $pull: { bookedSeats: { $in: uniqueSeats } },
    });
    throw err; // forwarded to the central error handler → 500
  }

  // STEP 5 — response
  res.status(201).json({ success: true, data: booking });
});

// GET /api/bookings/me
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.userId })
    .populate("movieId")
    .populate("showtimeId");
  res.status(200).json({ success: true, data: bookings });
});

// GET /api/bookings/:id
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("movieId")
    .populate("showtimeId");
  if (!booking) throw new AppError("Booking not found.", 404);

  const isOwner = booking.userId.toString() === req.user.userId;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw new AppError("Forbidden.", 403);

  res.status(200).json({ success: true, data: booking });
});

// DELETE /api/bookings/:id
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError("Booking not found.", 404);

  const isOwner = booking.userId.toString() === req.user.userId;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw new AppError("Forbidden.", 403);

  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled.", 400);
  }

  booking.status = "cancelled";
  await booking.save();

  // Release the seats for this showtime.
  const showtime = await Showtime.findById(booking.showtimeId);
  if (showtime) {
    showtime.bookedSeats = showtime.bookedSeats.filter(
      (seat) => !booking.seats.includes(seat)
    );
    await showtime.save();
  }

  res.status(200).json({ success: true, message: "Booking cancelled successfully." });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
