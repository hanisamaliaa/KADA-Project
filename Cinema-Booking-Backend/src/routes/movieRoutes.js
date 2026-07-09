const express = require("express");
const router = express.Router();

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
router.post("/", createMovie);

// PUT /api/movies/:id
// Admin - Update movie
router.put("/:id", updateMovie);

// DELETE /api/movies/:id
// Admin - Delete movie
router.delete("/:id", deleteMovie);

module.exports = router;
