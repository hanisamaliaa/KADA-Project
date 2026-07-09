const Booking = require("../models/Booking");
const Movie = require("../models/Movie");
const Showtime = require("../models/Showtime");
const User = require("../models/User");

// GET /api/admin/stats — statistik dashboard (§7.1, §9.5)
const getStats = async (req, res) => {
try {
    const [totalMovies, totalShowtimes, totalBookings, totalUsers] =
    await Promise.all([
        Movie.countDocuments(),
        Showtime.countDocuments(),
        Booking.countDocuments(),
        User.countDocuments(),
    ]);

    res.status(200).json({
    success: true,
    data: { totalMovies, totalShowtimes, totalBookings, totalUsers },
    });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
};

// GET /api/admin/bookings — semua booking untuk monitoring (§7.4, §9.4)
// Query opsional: ?page=&limit=
const getAllBookings = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [bookings, totalItems] = await Promise.all([
    Booking.find()
        .populate("userId", "name email")                 // siapa (tanpa password)
        .populate("movieId", "title")                     // film apa
        .populate("showtimeId", "date time studio price") // jadwal mana
        .sort({ createdAt: -1 })                          // terbaru dulu
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
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
};

module.exports = { getStats, getAllBookings };