const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const requireAdmin = require("../middlewares/requireAdmin");
const authenticate = require("../middlewares/authenticate");



const { createBooking } = require("../controllers/bookingController");

router.post("/", authenticate, createBooking);


module.exports = router;
