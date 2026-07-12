const request = require("supertest");
const app = require("../src/app");
const Movie = require("../src/models/Movie");
const Showtime = require("../src/models/Showtime");
const db = require("./helpers/db");

beforeAll(async () => {
  await db.connect();
});
afterEach(async () => {
  await db.clear();
});
afterAll(async () => {
  await db.close();
});

const { cookieFor } = require("./helpers/auth");
const userCookie = () => cookieFor();

const makeShowtimes = async () => {
  const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const movie = await Movie.create({
    title: "T",
    genre: "Action",
    duration: 120,
    rating: "PG-13",
    poster: "p.jpg",
    description: "d",
  });
  const st1 = await Showtime.create({ movieId: movie._id, date: future, time: "13:00", studio: "1", price: 50 });
  const st2 = await Showtime.create({ movieId: movie._id, date: future, time: "16:00", studio: "1", price: 50 });
  return { st1, st2 };
};

const book = (cookie, showtimeId, seats) =>
  request(app).post("/api/bookings").set("Cookie", cookie).send({ showtimeId, seats });

test("duplicate seat/showtime → 409; same seat different showtime → 201", async () => {
  const { st1, st2 } = await makeShowtimes();
  const u1 = await userCookie();
  const u2 = await userCookie();

  const a = await book(u1, st1._id.toString(), ["A1"]);
  expect(a.status).toBe(201);

  const b = await book(u2, st1._id.toString(), ["A1"]);
  expect(b.status).toBe(409);
  expect(b.body.unavailableSeats).toContain("A1");

  const c = await book(u2, st2._id.toString(), ["A1"]);
  expect(c.status).toBe(201);
});

test("cancel releases the seats", async () => {
  const { st1 } = await makeShowtimes();
  const u1 = await userCookie();
  const created = await book(u1, st1._id.toString(), ["B2"]);
  const del = await request(app)
    .delete(`/api/bookings/${created.body.data._id}`)
    .set("Cookie", u1);
  expect(del.status).toBe(200);
  const seats = await request(app).get(`/api/showtimes/${st1._id}/seats`);
  expect(seats.body.data.bookedSeats).not.toContain("B2");
});

test("non-owner cannot read another user's booking → 403", async () => {
  const { st1 } = await makeShowtimes();
  const u1 = await userCookie();
  const u2 = await userCookie();
  const created = await book(u1, st1._id.toString(), ["C3"]);
  const res = await request(app)
    .get(`/api/bookings/${created.body.data._id}`)
    .set("Cookie", u2);
  expect(res.status).toBe(403);
});
