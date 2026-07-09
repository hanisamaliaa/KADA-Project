const express = require("express");
const router = express.Router();

const Showtime = require("../models/Showtime");

// GET /api/movies/:movieId/showtimes
// Public - List showtimes for a movie
router.get("/movies/:movieId/showtimes", async (req, res) => {
  try {
    const showtimes = await Showtime.find({
      movieId: req.params.movieId,
    });

    res.status(200).json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/showtimes/:id
// Public - Get showtime details
router.get("/showtimes/:id", async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate("movieId");

    if (!showtime) {
      return res.status(404).json({
        message: "Showtime not found",
      });
    }

    res.status(200).json(showtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/showtimes/:id/seats
// Public - Get current seat availability
router.get("/showtimes/:id/seats", async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        message: "Showtime not found",
      });
    }

    res.status(200).json({
      totalSeats: showtime.totalSeats,
      bookedSeats: showtime.bookedSeats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/showtimes
// Admin - Create showtime
router.post("/showtimes", async (req, res) => {
  try {
    const showtime = await Showtime.create(req.body);

    res.status(201).json(showtime);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// PUT /api/showtimes/:id
// Admin - Update showtime
router.put("/showtimes/:id", async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!showtime) {
      return res.status(404).json({
        message: "Showtime not found",
      });
    }

    res.status(200).json(showtime);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE /api/showtimes/:id
// Admin - Delete showtime
router.delete("/showtimes/:id", async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        message: "Showtime not found",
      });
    }

    res.status(200).json({
      message: "Showtime deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
