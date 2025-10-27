import { Request, Response } from "express";
import { MessageService } from "../services/message.service";

export const getUsersForSidebar = async (req: Request, res: Response) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const { page = 1, limit = 10 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const skip: number = (Number(pageNum - 1)) * Number(limitNum);

    try {
        const loggedInUserId = req.user._id;

        // Paginated users
        const { filteredUsers } = await MessageService.getAllUsers(loggedInUserId, skip, limitNum);

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
        const { messages, error } = await MessageService.getMessages(userToChatId, myId);

        if (error) {
            return res.status(400).json({ status: false, message: error })
        }
        return res.status(200).json({ status: true, data: messages });

    } catch (error) {
        console.log('Error in getting messages:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}

export const sendMessage = async (req: Request, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const { message, error } = await MessageService.sendMessage(senderId, receiverId, text, image);

        if (error) {
            console.error("Error in sendMessage:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error" });
        }

        return res.status(201).json({ status: true, data: message });
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const pingServer = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            status: true,
            message: 'Server is reachable',
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("Ping failed:", error);
        return res.status(500).json({ status: false, message: "Ping failed" });
    }
}