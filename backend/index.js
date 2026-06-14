import express from "express";
import dotenv from "dotenv";

dotenv.config();

const server = express();

const startServer = async () => {
    try {
        server.listen(process.env.PORT, () => {
            console.log("Server is listening on port 4000");
        });
    } catch (err) {
        console.log("Error when listening to port : \n", err);
    }
}

startServer();