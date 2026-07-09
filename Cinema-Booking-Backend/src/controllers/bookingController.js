const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");

// Helper untuk menggabungkan date + time menjadi DateTime
const getShowtimeDateTime = (showtime) => {
const dateTime = new Date(showtime.date);

const [hours, minutes] = showtime.time.split(":").map(Number);

dateTime.setHours(hours, minutes, 0, 0);

return dateTime;
};

// POST /api/bookings
const createBooking = async (req, res) => {
try {
    const { showtimeId, seats } = req.body;

    // STEP 1 — Validasi input
    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
        success: false,
        message: "Showtime ID and seats are required.",
    });
    }

    // STEP 2 — Cari showtime
    const showtime = await Showtime.findById(showtimeId);

    if (!showtime) {
    return res.status(404).json({
        success: false,
        message: "Showtime not found.",
    });
    }

    // Tidak boleh booking showtime yang sudah lewat
    const showDateTime = getShowtimeDateTime(showtime);
    const now = new Date();

    if (showDateTime < now) {
    return res.status(400).json({
        success: false,
        message: "Cannot book a past showtime.",
    });
    }

    // STEP 3 — Cek konflik kursi
    const unavailable = seats.filter((seat) =>
    showtime.bookedSeats.includes(seat)
    );

    if (unavailable.length > 0) {
    return res.status(409).json({
        success: false,
        message: "One or more selected seats are no longer available.",
        unavailableSeats: unavailable,
    });
    }

    // STEP 4 — Hitung harga di server
    const totalPrice = showtime.price * seats.length;

    // STEP 5 — Simpan booking
    const booking = await Booking.create({
        userId: req.user.userId,
        movieId: showtime.movieId,
        showtimeId,
        seats,
        totalPrice,
    });

    // STEP 6 — Tandai kursi telah dibooking
    showtime.bookedSeats.push(...seats);
    await showtime.save();

    // STEP 7 — Response
    res.status(201).json({
        success: true,
        data: booking,
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
}
};

// GET /api/bookings/me
const getMyBookings = async (req, res) => {
try {
    const bookings = await Booking.find({
    userId: req.user.userId,
    })
    .populate("movieId")
    .populate("showtimeId");

    res.status(200).json({
        success: true,
        data: bookings,
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
}
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
try {
    const booking = await Booking.findById(req.params.id)
    .populate("movieId")
    .populate("showtimeId");

    if (!booking) {
    return res.status(404).json({
        success: false,
        message: "Booking not found.",
    });
    }

    const isOwner = booking.userId.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
    return res.status(403).json({
        success: false,
        message: "Forbidden.",
    });
    }

    res.status(200).json({
        success: true,
        data: booking,
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
}
};

// DELETE /api/bookings/:id
const cancelBooking = async (req, res) => {
try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
    return res.status(404).json({
        success: false,
        message: "Booking not found.",
    });
    }

    const isOwner = booking.userId.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
    return res.status(403).json({
        success: false,
        message: "Forbidden.",
    });
    }

    // Booking sudah pernah dibatalkan
    if (booking.status === "cancelled") {
    return res.status(400).json({
        success: false,
        message: "Booking is already cancelled.",
    });
    }

    // Ubah status booking
    booking.status = "cancelled";
    await booking.save();

    // Lepaskan kursi
    const showtime = await Showtime.findById(booking.showtimeId);

    if (showtime) {
    showtime.bookedSeats = showtime.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
    );

    await showtime.save();
    }

    res.status(200).json({
        success: true,
        message: "Booking cancelled successfully.",
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
}
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
};