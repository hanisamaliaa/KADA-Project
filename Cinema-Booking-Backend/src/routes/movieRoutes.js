const express = require("express");
const router = express.Router();
const requireAdmin = require("../middlewares/requireAdmin");

const {
  getMovies,
  getMovieDetail,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

// GET /api/movies
// Public - List all movies
router.get("/", getMovies);

// GET /api/movies/:id
// Public - Get one movie
router.get("/:id", getMovieDetail);

// POST /api/movies
// Admin - Create movie
router.post("/", requireAdmin, createMovie);

// PUT /api/movies/:id
// Admin - Update movie
router.put("/:id", requireAdmin, updateMovie);

// DELETE /api/movies/:id
// Admin - Delete movie
router.delete("/:id", requireAdmin, deleteMovie);

module.exports = router;
