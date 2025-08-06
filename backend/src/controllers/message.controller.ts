import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../utils/cloudinary";

export const getUsersForSidebar = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json({ status: true, message: "Sidebar users fetched", data: filteredUsers });
    } catch (error) {
        console.log("Error in get users sidebar:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

export const getMessage = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params;

        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, recieverId: myId }
            ]
        });

        return res.status(200).json({ status: true, data: messages });
    } catch (error) {
        console.log('Error in getting messages:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (err) {
                console.log("Cloudinary upload failed:", err);
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // todo: realtime functionality goes here socket.io
        return res.status(201).json({ status: true, data: newMessage });
    } catch (error) {
        console.log('Error in creating message:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}