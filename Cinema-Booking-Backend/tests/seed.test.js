const { seedData } = require("../src/seeds/seed");
const User = require("../src/models/User");
const Movie = require("../src/models/Movie");
const Showtime = require("../src/models/Showtime");
const db = require("./helpers/db");

beforeAll(async () => {
  await db.connect();
});
afterAll(async () => {
  await db.close();
});

test("seed creates 1 admin, 2 users, >=5 movies, and showtimes across >=2 movies", async () => {
  const result = await seedData();
  expect(await User.countDocuments({ role: "admin" })).toBe(1);
  expect(await User.countDocuments({ role: "user" })).toBe(2);
  expect(await Movie.countDocuments()).toBeGreaterThanOrEqual(5);
  expect(await Movie.countDocuments({ trailerUrl: { $exists: true, $ne: null } })).toBeGreaterThanOrEqual(1);
  const distinctMovies = await Showtime.distinct("movieId");
  expect(distinctMovies.length).toBeGreaterThanOrEqual(2);
  expect(result.movies).toBeGreaterThanOrEqual(5);
});
