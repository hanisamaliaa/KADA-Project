const Showtime = require("../models/Showtime");
const Movie = require("../models/Movie");

// GET /api/showtimes?movieId=&date=   (Public)
const getShowtimes = async (req, res) => {
  try {
    const filter = {};

    // Filter berdasarkan movie
    if (req.query.movieId) {
      filter.movieId = req.query.movieId;
    }

    // Filter berdasarkan tanggal (opsional)
    if (req.query.date) {
      const start = new Date(req.query.date);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date query parameter. Use ISO format (YYYY-MM-DD).",
        });
      }
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const showtimes = await Showtime.find(filter).populate("movieId");

    res.status(200).json({
      success: true,
      data: showtimes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/showtimes/:id   (Public)
const getShowtimeDetail = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate("movieId");

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    res.status(200).json({
      success: true,
      data: showtime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/showtimes/:id/seats   (Public)
const getSeats = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bookedSeats: showtime.bookedSeats,
        layout: {
          rows: 8,
          columns: 10,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/showtimes   (Admin)
const createShowtime = async (req, res) => {
  try {
    // Pastikan movie ada
    const movie = await Movie.findById(req.body.movieId);

    if (!movie) {
      return res.status(400).json({
        success: false,
        message: "Movie not found",
      });
    }

    const showtime = await Showtime.create(req.body);

    res.status(201).json({
      success: true,
      data: showtime,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/showtimes/:id   (Admin)
const updateShowtime = async (req, res) => {
  try {
    // kalau body menyertakan movieId, pastikan movie-nya ada
    if (req.body.movieId) {
      const movie = await Movie.findById(req.body.movieId);
      if (!movie) {
        return res.status(400).json({ success: false, message: "Movie not found" });
      }
    }

    const showtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!showtime) {
      return res.status(404).json({ success: false, message: "Showtime not found" });
    }

    res.status(200).json({ success: true, data: showtime });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/showtimes/:id   (Admin)
const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Showtime deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getShowtimes,
  getShowtimeDetail,
  getSeats,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};