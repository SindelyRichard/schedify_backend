import mongoose from "mongoose";
import Task from "../models/Task.js";

await mongoose.connect(process.env.MONGO_URI);

await Task.updateMany(
  { daily: true },
  { completed: false }
);

console.log("Daily tasks reset completed");

process.exit();
