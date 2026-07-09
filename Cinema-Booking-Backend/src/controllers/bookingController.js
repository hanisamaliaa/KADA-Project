const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");

const createBooking = async (req, res) => {
    try {
        const { showtimeId, seats } = req.body;

        if(!showtimeId || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid showtime or seats" });
        }

        // Check if the showtime exists
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ 
                success: false,
                message: "Showtime not found" });
        }

        // Check if the requested seats are available
        const unavailableSeats = seats.filter(seat => showtime.bookedSeats.includes(seat));
        if (unavailableSeats.length > 0) {
            return res.status(409).json({ 
                success: false,
                message: "Some requested seats are already booked", 
                unavailableSeats });
        }

        const totalPrice = seats.length * showtime.price;

        // Create the booking
        const booking = await Booking.create({
            userId: req.user.userId,
            movieId: showtime.movieId,
            showtimeId,
            seats,
            totalPrice,
        });

        // Update the showtime with the booked seats
        showtime.bookedSeats.push(...seats);
        await showtime.save();

        res.status(201).json({ 
            success: true,
            message: "Booking created successfully", 
            data: booking });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message });
    }
};

module.exports = {
    createBooking,
};