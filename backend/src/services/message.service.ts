import Message from "../models/message.model";
import User from "../models/user.model";
import { getReceiverSocketId, io } from "../lib/socket";
import cloudinary from "../utils/cloudinary";

export class MessageService {
    static async getAllUsers(id: string, skip: number, limitNum: number) {
        const filteredUsers =
            await User.find({ _id: { $ne: id } }).
                select("-password").
                skip(skip).
                limit(limitNum);

        return { filteredUsers };
    }

    static async getMessages(toChatWithId: string, currentUserId: string, limit: number = 50, before?: Date) {
        try {

            const query: Record<string, any> = {
                $or: [
                    { senderId: currentUserId, receiverId: toChatWithId },
                    { senderId: toChatWithId, receiverId: currentUserId }
                ]
            };


            // Cursor given for getting mssg prvs the createdAt
            if (before) {
                query['createdAt'] = { $lt: before };
            }

            // Sorting the messages in reverse
            const messages = await Message.find(query).
                sort({ createdAt: -1 }).
                limit(limit + 1);

            const hasMore = messages.length > limit;
            const messagesToReturn = hasMore ? messages.slice(0, -1) : messages;

            // Return in chronological order (oldest first) for the UI
            const chronologicalMessages = messagesToReturn.reverse();

            // Get the oldest message's date for next cursor
            const nextCursor = chronologicalMessages.length > 0
                ? chronologicalMessages[0].createdAt // Oldest message's date
                : null;

            return { 
                messages: messagesToReturn, 
                hasMore, 
                nextCursor, 
                error: '' 
            };
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