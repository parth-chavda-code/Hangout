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

//uploads images
app.use("/uploads", express.static("uploads"));

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
    //sends user online status
    socket.emit("onlineUsers", {
        onlineUsers
    });

    //user add in onlineUsers
    socket.on("registerUser", (userId) => {
        onlineUsers[userId] = socket.id;

        //Everyone should know that the registered user is online because after we do onlineUsers[userId] = socket.id; then we add new connected user id into onlineUsers object
        io.emit("onlineUsers", {
            onlineUsers
        });

    });

    //message save to DB
    socket.on("sendMessage", async (data) => {
        try {
            const responseData = await messageModel.create({
                content: data.content,
                senderId: data.senderId,
                receiverId: data.receiverId
            });

            //Check for online status
            const receiverSocketId = onlineUsers[responseData.receiverId];

            //for sender side UI, the below line verifies that the message has been sent successfully
            socket.emit("newMessage", responseData);
            
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", responseData);
            }

        } catch (err) {
            console.log("Error when saving message to DB");
            return;
        }
    });


    socket.on("disconnect", () => {

        for (const userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                break;
            }
        }

        //Frontend should know about the offline status
        io.emit("onlineUsers", {
            onlineUsers
        });
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
