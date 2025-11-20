import express from "express";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";
import { getCars, getCarById, addCar } from "../controllers/carController.js";
import Car from "../models/Car.js";

const router = express.Router();

router.get("/", getCars);
router.get("/:id", getCarById);
router.post("/add", protect, verifyAdmin, addCar);
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
