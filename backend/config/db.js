import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log("DB connected successfully");
    } catch (err) {
        throw new Error("DB connection unsuccessfull");
    }
}