import express from "express";
import { auth } from "../middleware/auth.js";
import { getMessage, sendMessage } from "../controllers/message.js";

const messageRouter = express.Router();

//send message
messageRouter.post("/sendmessage/:receiverId", auth, sendMessage);
//get message
messageRouter.get("/getmessage/:receiverId", auth, getMessage);

export { messageRouter };