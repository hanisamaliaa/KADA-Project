const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const requireAdmin = require("../middlewares/requireAdmin");
const {
  getShowtimes, getShowtimeDetail, getSeats,
  createShowtime, updateShowtime, deleteShowtime,
} = require("../controllers/showtimeController");

router.get("/", getShowtimes);
router.get("/:id", getShowtimeDetail);
router.get("/:id/seats", getSeats);
router.post("/", authenticate, requireAdmin, createShowtime);
router.put("/:id", authenticate, requireAdmin, updateShowtime);
router.delete("/:id", authenticate, requireAdmin, deleteShowtime);

module.exports = router;