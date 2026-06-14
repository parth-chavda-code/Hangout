import mongoose from "mongoose";

const { Schema } = mongoose;

const message = new Schema({
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "room", required: true },
}, { timestamps: true });

const messageModel = mongoose.model("messages", message);

export { messageModel };