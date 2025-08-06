import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import type { ContactStore } from "../types/store";

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

    // todo: optimize this later
    setSelectedUser: (data) => set({ selectedUser: data })

}))