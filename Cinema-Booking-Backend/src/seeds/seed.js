const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Showtime = require("../models/Showtime");
const Booking = require("../models/Booking");

// Populate the database with challenge-only data (§11.7):
// 1 admin, 2 users, 5 movies, and showtimes across multiple movies.
// Idempotent: clears the relevant collections first so it can be re-run.
const seedData = async () => {
  await Promise.all([
    User.deleteMany({}),
    Movie.deleteMany({}),
    Showtime.deleteMany({}),
    Booking.deleteMany({}),
  ]);

  const [adminPass, userPass] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("user123", 10),
  ]);

  await User.create([
    { name: "Admin", email: "admin@kada.com", password: adminPass, role: "admin", isVerified: true },
    { name: "User One", email: "user1@kada.com", password: userPass, role: "user", isVerified: true },
    { name: "User Two", email: "user2@kada.com", password: userPass, role: "user", isVerified: true },
  ]);

  // trailerUrl is optional (YouTube link for the trailer preview). "Inside Out 2"
  // is intentionally left without one to show the no-trailer case still works.
  const movies = await Movie.create([
    { title: "Avengers: Endgame", genre: "Action", duration: 181, rating: "PG-13", poster: "avengers.jpg", trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c", description: "The Avengers assemble once more to reverse Thanos' snap." },
    { title: "Dune: Part Two", genre: "Sci-Fi", duration: 166, rating: "PG-13", poster: "dune.jpg", trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w", description: "Paul Atreides unites with the Fremen to wage war." },
    { title: "Inside Out 2", genre: "Animation", duration: 96, rating: "PG", poster: "insideout2.jpg", description: "New emotions move into Riley's mind." },
    { title: "Oppenheimer", genre: "Drama", duration: 180, rating: "R", poster: "oppenheimer.jpg", trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg", description: "The story of the father of the atomic bomb." },
    { title: "The Batman", genre: "Action", duration: 176, rating: "PG-13", poster: "batman.jpg", trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4", description: "Batman uncovers corruption while pursuing the Riddler." },
  ]);

  // Showtimes tomorrow so they are always bookable during evaluation.
  const day = new Date();
  day.setDate(day.getDate() + 1);

  const showtimeDocs = [
    { movieId: movies[0]._id, date: day, time: "13:00", studio: "Studio 1", price: 50000 },
    { movieId: movies[0]._id, date: day, time: "16:00", studio: "Studio 1", price: 55000 },
    { movieId: movies[1]._id, date: day, time: "14:00", studio: "Studio 2", price: 60000 },
    { movieId: movies[1]._id, date: day, time: "19:00", studio: "Studio 2", price: 65000 },
    { movieId: movies[4]._id, date: day, time: "20:00", studio: "Studio 3", price: 70000 },
  ];
  await Showtime.create(showtimeDocs);

  return { users: 3, movies: movies.length, showtimes: showtimeDocs.length };
};

module.exports = { seedData };

// Allow running directly: `npm run seed`.
if (require.main === module) {
  require("dotenv").config();
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      const result = await seedData();
      console.log("Seed complete:", result);
      await mongoose.disconnect();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
