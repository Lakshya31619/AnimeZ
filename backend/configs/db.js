import mongoose from "mongoose";

// Cache the connection across Vercel serverless function calls
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async () => {
    try {
        if (cached.conn) {
            console.log('Using cached DB connection');
            return cached.conn;
        }

        if (!cached.promise) {
            cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/animez`);
        }

        mongoose.connection.on('connected', () => console.log('Database Connected'));

        cached.conn = await cached.promise;
        return cached.conn;

    } catch (error) {
        cached.promise = null; // reset so next request retries
        console.log(error.message);
    }
};

export default connectDB;