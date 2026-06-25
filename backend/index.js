import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/user.js";
import { messageRouter } from "./routes/message.js";
import { messageModel } from "./models/Message.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

//cors for express 
app.use(cors({
    origin: "http://localhost:5173"
}));
//express routes
app.use(express.json());
app.use("/user", userRouter);
app.use("/message", messageRouter);

//Socket io
const onlineUsers = {};

io.on("connection", (socket) => {
    console.log("User is connected = ", socket.id);

    //user add in onlineUsers
    socket.on("registerUser", (userId) => {
        onlineUsers[userId] = socket.id;
        console.log("All connected users = ", onlineUsers);
    });

    //message save to DB
    socket.on("sendMessage", async (data) => {
        try {
            await messageModel.create({
                content: data.content,
                senderId: data.senderId,
                receiverId: data.receiverId
            });
        } catch (err) {
            console.log("Error when saving message to DB");
            return;
        }
        //Check for online status
        const receiverSocketId = onlineUsers[data.receiverId];

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", data);
        }
    });


    socket.on("disconnect", () => {
        console.log("User is disconnected = ", socket.id);

        for (const userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                break;
            }
        }
    });
});

const startServer = async () => {
    try {
        await connectDB();
        httpServer.listen(process.env.PORT, () => {
            console.log("Server is listening on port ", process.env.PORT);
        });
    } catch (err) {
        console.log("Error when listening to port : \n", err);
    }
}

startServer();
