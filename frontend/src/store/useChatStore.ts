import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import type { ContactStore } from "../types/store";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ContactStore>((set, get) => ({
    isUsersLoading: false,
    isMessagesLoading: false,
    isMessageSending: false,
    users: [],
    messages: [],
    typingUsers: [],
    selectedUser: null,


    getUsers: async () => {
        set(({ isUsersLoading: true }));
        try {
            const res = await axiosInstance.get('/message/users');
            set({ users: res.data.data });
        } catch (error) {
            toast.error('Error getting contacts');
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data.data });
        } catch (error) {
            toast.error('Error getting messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessages: async (messageData: any) => {
        set({ isMessageSending: true })

        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser?._id}`, messageData);
            set({ messages: [...messages, res.data.data] });
        } catch (error) {
            toast.error('Error sending messages');
        } finally {
            set({ isMessageSending: false });
        }

    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        const authUser = useAuthStore.getState().authUser;

        if (!selectedUser || !socket) return;


        socket.on("newMessage", (newMessage) => {
            // if message not the selectedUser
            const isRelevantMessage =
                (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser?._id) ||
                (newMessage.receiverId === selectedUser._id && newMessage.senderId === authUser?._id);

            if (isRelevantMessage) {
                set({ messages: [...get().messages, newMessage] });
            }
        })

        // Typing event listener
        socket.on("userTyping", (data: { senderId: string, isTyping: boolean }) => {
            console.log("Received typing event:", data); // Debug log
            if (data.senderId === selectedUser._id) {
                get().setTypingUser(data.senderId, data.isTyping);
            }
        });
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("newMessage");
        socket.off("userTyping");
    },

    // Typing actions
    startTyping: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;

        if (!selectedUser || !socket) return;

        socket.emit("typing", {
            receiverId: selectedUser._id,
            isTyping: true
        });
    },

    stopTyping: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;

        if (!selectedUser || !socket) return;

        socket.emit("typing", {
            receiverId: selectedUser._id,
            isTyping: false
        });
    },

    setTypingUser: (userId: string, isTyping: boolean) => {
        set(state => {
            if (isTyping) {
                return state.typingUsers.includes(userId)
                    ? state
                    : { typingUsers: [...state.typingUsers, userId] };
            } else {
                return {
                    typingUsers: state.typingUsers.filter(id => id !== userId)
                };
            }
        });
    },

    setSelectedUser: (data) => set({ selectedUser: data })

}))