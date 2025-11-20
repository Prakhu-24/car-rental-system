import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// ✅ Create booking (User)
router.post("/", protect, createBooking);

// ✅ Get logged-in user's bookings
router.get("/my", protect, getMyBookings);

// ✅ Cancel booking
router.delete("/:id", protect, cancelBooking);

// ✅ ADMIN: Get all bookings
router.get("/all", protect, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("car", "name brand pricePerDay")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error loading all bookings:", err);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
});

export default router;
