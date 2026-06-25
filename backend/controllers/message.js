import { messageModel } from "../models/Message.js";

//send message
export const sendMessage = async (req, res) => {
    const { content } = req.body;
    const senderId = req.id;
    const receiverId = req.params.receiverId;

    try {
        await messageModel.create({
            content,
            senderId,
            receiverId
        });

        res.json({
            msg: "Message sent successfully"
        });
    } catch (err) {
        res.status(500).json({
            msg: "Error in sending the message",
            error: err.message
        });
    }
}

export const getMessage = async (req, res) => {
    const senderId = req.id;
    const receiverId = req.params.receiverId;

    try {
        const response = await messageModel.find(
            { $or: [{ senderId: senderId, receiverId: receiverId }, { senderId: receiverId, receiverId: senderId }] }
        );

        res.json({
            response: response
        });
        
    } catch (err) {
        res.status(500).json({
            msg: "Error when getting the messages",
            error: err.message
        });
    }
}