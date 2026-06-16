import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/user.js";

dotenv.config();

const app = express();

const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log("Server is listening on port ", process.env.PORT);
        });
    } catch (err) {
        console.log("Error when listening to port : \n", err);
    }
}

app.use(express.json());

app.use("/user", userRouter);

startServer();
