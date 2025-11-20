import Car from "../models/Car.js";

export const getCars = async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// addCar if you have admin endpoint already
export const addCar = async (req, res) => {
  try {
    const { name, brand, pricePerDay, imageUrl } = req.body;
    const newCar = await Car.create({ name, brand, pricePerDay, imageUrl, available: true });
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
