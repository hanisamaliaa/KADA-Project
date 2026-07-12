const Movie = require("../models/Movie");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
  const movie = await Movie.create(req.body);
  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: movie,
  });
});

// PUT /api/movies/:id
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!movie) throw new AppError("Movie not found", 404);
  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    data: movie,
  });
});

// DELETE /api/movies/:id
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) throw new AppError("Movie not found", 404);
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
