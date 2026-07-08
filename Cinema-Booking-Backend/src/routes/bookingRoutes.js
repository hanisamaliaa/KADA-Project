const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

// const auth = require("../middlewares/auth");
// const isAdmin = require("../middlewares/isAdmin");

// POST /api/bookings
// Authenticated - Create booking
router.post(
  "/",
  /* auth, */ async (req, res) => {
    try {
      const booking = await Booking.create(req.body);

      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
);

// GET /api/bookings/me
// Authenticated - Get current user's bookings
router.get(
  "/me",
  /* auth, */ async (req, res) => {
    try {
      const bookings = await Booking.find({
        userId: req.user.id,
      })
        .populate("movieId")
        .populate("showtimeId");

      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

// GET /api/bookings/:id
// Owner/Admin - Get booking detail
router.get(
  "/:id",
  /* auth, */ async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("movieId")
        .populate("showtimeId")
        .populate("userId");

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      // Tambahkan pengecekan owner/admin di sini

      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

// DELETE /api/bookings/:id
// Owner/Admin - Cancel booking
router.delete(
  "/:id",
  /* auth, */ async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      // Release seat (implementasi berikutnya)
      // Tambahkan pengecekan owner/admin

      booking.status = "cancelled";
      await booking.save();

      res.status(200).json({
        message: "Booking cancelled successfully",
        booking,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

module.exports = router;
