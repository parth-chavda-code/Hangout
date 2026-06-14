import mongoose from "mongoose";

const { Schema } = mongoose;

const room = new Schema({
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "users" }]
});

const roomModel = mongoose.model("rooms", room);

export { roomModel };