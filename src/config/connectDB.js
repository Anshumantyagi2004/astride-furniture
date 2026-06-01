import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

async function connectDB() {
    const MONGO_URI = process.env.MONGODB_URI;

    if (!MONGO_URI) {
        throw new Error("Please add MONGODB_URI in .env");
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;

    return cached.conn;
}

export default connectDB;