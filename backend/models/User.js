import mongoose from "mongoose";

const { Schema } = mongoose;

const user = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    isOnline: { type: Boolean, default: false } 
});

const userModel = mongoose.model("users", user);

export { userModel };