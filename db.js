import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
let connection = null;

if (!process.env.MONGO_URL) {
    throw new Error("Please set the MONGO_URL environment variable");
}

async function dbconnect() {
    if (connection) return connection;

    try {
        connection = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
        return connection;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export default dbconnect;
