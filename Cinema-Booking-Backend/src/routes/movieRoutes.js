const express = require("express");
const router = express.Router();
const requireAdmin = require("../middlewares/requireAdmin");
const authenticate = require("../middlewares/authenticate");

const {
  getMovies,
  getMovieDetail,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");


router.get("/", getMovies);

router.get("/:id", getMovieDetail);

router.post("/", authenticate, requireAdmin, createMovie);

router.put("/:id", authenticate, requireAdmin, updateMovie);

router.delete("/:id", authenticate, requireAdmin, deleteMovie);

module.exports = router;
