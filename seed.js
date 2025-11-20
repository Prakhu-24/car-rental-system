import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "./models/Car.js";

dotenv.config();

const cars = [
  {
    name: "Swift Dzire",
    brand: "Maruti",
    pricePerDay: 1800,
    imageUrl: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Dzire/11387/1758802554630/front-left-side-47.jpg?tr=w-664"
  },
  {
    name: "Creta",
    brand: "Hyundai",
    pricePerDay: 3500,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBO43FBRdQNXwh1Mn0IanOSyQ11n4yzw3J7k7PHOJSVD5ryD_3xbet5VpoQ_c6es0S_tKmPvTXUxO6K4_QXJrVFPEAZ2EfMjJGrm8N8qzg&s=10"
  },
  {
    name: "Fortuner",
    brand: "Toyota",
    pricePerDay: 6000,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJBoBOcufULQksxe__VYYe-in2UnGs1ep2JOD-L0MGASGT_ZaUkAB5YU-pLPJ5W2L-jC0G_YzQQhHXNQ1ZfvBXrcnNxdlbr2zLky0p7u0Y&s=10"
  },
  {
    name: "City",
    brand: "Honda",
    pricePerDay: 3000,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm4lheOZ_21tSzXeJFnd2K5aEiEqIgHBUrXrX5rY8TmpijzxwZTYvyYN-PKJ11ttpCZwxCl-uKu1sdaEvHzO4C1pwMoEiaolnQ5VBmZ4A_8g&s=10"
  },
  {
    name: "i20",
    brand: "Hyundai",
    pricePerDay: 2500,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtXeI5R_sOr7gNoYI5Ks1tMS7SfEXrn_uwGduEUE4FtgnGc42kgqVOY2f85gz-HC8Qw92p-iXJbOGdcAm9ScxpQQh0r_uXy-vG2EhphgPB&s=10"
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Car.deleteMany(); // clear old data
    await Car.insertMany(cars);
    console.log("✅ Cars added successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
  }
})();
