import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import jwt from "jsonwebtoken";

const getUserId = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET).id;
};

export const createBooking = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { carId, startDate, endDate } = req.body;

    const car = await Car.findById(carId);
    if (!car || !car.available)
      return res.status(400).json({ message: "Car not available" });

    // Calculate total amount based on days × pricePerDay
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const totalAmount = days * car.pricePerDay;

    await Booking.create({
      user: userId,
      car: carId,
      startDate,
      endDate,
      totalAmount,
    });

    car.available = false;
    await car.save();

    res.status(201).json({ message: "Car booked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getMyBookings = async (req, res) => {
  try {
    const userId = getUserId(req);
    const bookings = await Booking.find({ user: userId }).populate("car");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const userId = getUserId(req);
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the user who booked or admin can cancel
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // Delete booking and make car available again
    await Booking.findByIdAndDelete(req.params.id);
    await Car.findByIdAndUpdate(booking.car, { available: true });

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


