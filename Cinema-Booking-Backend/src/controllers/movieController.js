const fs = require("fs");
const path = require("path");
const Movie = require("../models/Movie");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const POSTERS_DIR = path.join(__dirname, "../../uploads/posters");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Helper: delete a poster file if it exists and is a local upload
const deletePosterFile = (posterPath) => {
  if (!posterPath) return;
  // Only delete local uploads, not external URLs
  if (posterPath.startsWith("/uploads/")) {
    const fullPath = path.join(__dirname, "../..", posterPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// GET /api/movies  (search, genre filter, pagination)
const getMovies = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (typeof req.query.search === "string" && req.query.search.trim()) {
    filter.title = { $regex: escapeRegex(req.query.search.trim()), $options: "i" };
  }
  if (typeof req.query.genre === "string" && req.query.genre.trim()) {
    filter.genre = { $regex: `^${escapeRegex(req.query.genre.trim())}$`, $options: "i" };
  }

  const [movies, totalItems] = await Promise.all([
    Movie.find(filter).skip(skip).limit(limit),
    Movie.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: movies,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  });
});

// GET /api/movies/:id
const getMovieDetail = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new AppError("Movie not found", 404);
  res.status(200).json({ success: true, data: movie });
});

// POST /api/movies
const createMovie = asyncHandler(async (req, res) => {
  // If a file was uploaded, use its path; otherwise require poster in body
  if (req.file) {
    req.body.poster = `/uploads/posters/${req.file.filename}`;
  }

  if (!req.body.poster) {
    throw new AppError("Poster image is required", 400);
  }

  const movie = await Movie.create(req.body);
  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: movie,
  });
});

// PUT /api/movies/:id
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new AppError("Movie not found", 404);

  // If a new file was uploaded, use it and delete the old one
  if (req.file) {
    deletePosterFile(movie.poster);
    req.body.poster = `/uploads/posters/${req.file.filename}`;
  }

  const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    data: updated,
  });
});

// DELETE /api/movies/:id
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) throw new AppError("Movie not found", 404);

  // Clean up the poster file
  deletePosterFile(movie.poster);

  res.status(200).json({
    success: true,
    message: "Movie deleted successfully",
  });
});

module.exports = {
  getMovies,
  getMovieDetail,
  createMovie,
  updateMovie,
  deleteMovie,
};
