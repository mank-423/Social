import Message from "../models/message.model";
import User from "../models/user.model";
import { getReceiverSocketId, io } from "../lib/socket";
import cloudinary from "../utils/cloudinary";

export class MessageService {
    static async getAllUsers(id: string) {
        const filteredUsers = await User.find({ _id: { $ne: id } }).select("-password");
        return { filteredUsers };
    }

    static async getMessages(toChatWithId: string, currentUserId: string) {
        try {
            const messages = await Message.find({
                $or: [
                    { senderId: currentUserId, receiverId: toChatWithId },
                    { senderId: toChatWithId, receiverId: currentUserId }
                ]
            });

            return { messages, error: '' };
        } catch (error) {
            return { messages: [], error };
        }
    }

    static async sendMessage(senderId: string, receiverId: string, text?: string, image?: string) {
        try {
            let imageUrl: string | undefined;

            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            }

            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                image: imageUrl,
            });

            await newMessage.save();

            // Real-time emit to receiver if online
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            return { message: newMessage, error: "" };
        } catch (error) {
            return { message: null, error };
        }
    }
}