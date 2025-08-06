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
    selectedUser: null,


    getUsers: async () => {
        set(({ isUsersLoading: true }));
        try {
            const res = await axiosInstance.get('/message/users');
            console.log("Contact list:", res.data.data);
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
            console.log('Messages:', res.data);
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
            console.log("res:", res);
            set({ messages: [...messages, res.data.data] });
        } catch (error) {
            toast.error('Error sending messages');
        } finally{
            set({isMessageSending: false});
        }

    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        const socket = useAuthStore.getState().socket;

        if (!selectedUser || !socket) return;

        

        socket.on("newMessage", (newMessage) => {
            // if message not the selectedUser
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (isMessageSentFromSelectedUser) return;

            set({messages: [...get().messages, newMessage]})
        })
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        
        if (!socket) return;

        socket.off("newMessage");
    },

    setSelectedUser: (data) => set({ selectedUser: data })

}))