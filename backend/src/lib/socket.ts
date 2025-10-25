import { Server, Socket } from "socket.io"
import http from "http"
import express from "express"

const app = express();
const server = http.createServer(app);

// Extend Socket interface
declare module "socket.io" {
    interface Socket {
        userId?: string;
    }
}

const io = new Server(server, {
    cors: {
        origin: process.env.FRONT_END_URL || "http://localhost:5173",
        credentials: true,
    }
});

// Better to use Map for performance
const userSocketMap: Map<string, string> = new Map(); // Used for online / offline

const socketUserMap: Map<string, string> = new Map(); // Used for typing

export const getReceiverSocketId = (userId: string): string | undefined => {
    return userSocketMap.get(userId);
}

export const getUserIdFromSocket = (socketId: string): string | undefined => {
    return socketUserMap.get(socketId);
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId as string;

    if (userId) {
        // Store both mappings
        userSocketMap.set(userId, socket.id);
        socketUserMap.set(socket.id, userId);
        socket.userId = userId;
        
        // Join user to their personal room
        socket.join(`user-${userId}`);
    }

    // Send online users to everyone
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    // Typing indicator handler
    socket.on("typing", (data: { receiverId: string, isTyping: boolean }) => {
        const { receiverId, isTyping } = data;
        
        // Send to specific user's room
        io.to(`user-${receiverId}`).emit('userTyping', {
            senderId: socket.userId,
            isTyping,
        });
    });

    // Message read receipts
    socket.on("messageRead", (data: { messageId: string, readerId: string }) => {
        // Notify the sender that their message was read
        io.to(`user-${data.readerId}`).emit("messageRead", data);
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
        console.log("User disconnected:", socket.id, "Reason:", reason);
        
        const userId = socketUserMap.get(socket.id);
        if (userId) {
            userSocketMap.delete(userId);
            socketUserMap.delete(socket.id);
        }
        
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });

    // Handle voluntary leave
    socket.on("leaveChat", (chatId: string) => {
        socket.leave(`chat-${chatId}`);
    });

    // Handle join specific chat
    socket.on("joinChat", (chatId: string) => {
        socket.join(`chat-${chatId}`);
    });
});

export { io, app, server };