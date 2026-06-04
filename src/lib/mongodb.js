import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  try {
    if (mongoose.connection.readyState) {
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");

  } catch (error) {
    console.log(error);
  }
}