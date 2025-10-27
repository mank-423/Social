import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import type { ContactStore } from "../types/store";
import { useAuthStore } from "./useAuthStore";
import type { messageStructure, QueuedMessage } from "../types/message";
import { isServerReachable } from "../utils/network";

export const useChatStore = create<ContactStore>((set, get) => ({
    isUsersLoading: false,
    isMessagesLoading: false,
    isMessageSending: false,
    users: [],
    messages: [],
    typingUsers: [],
    selectedUser: null,


    getUsers: async (page: number = 1) => {
        set(({ isUsersLoading: true }));
        try {
            const res = await axiosInstance.get(`/message/users?page=${page}&limit=10`);
            
            // set({ users: res.data.data });

            // New paginated setting of users
            set((state) => ({
                users: page === 1 ? res.data.data : [...state.users, ...res.data.data]
            }));

            return res;
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

        const isOnline = await isServerReachable();

        if (!isOnline) {
            toast('Check your network', {
                icon: '⚠️',
                style: {
                    border: '1px solid #facc15',
                    padding: '12px 16px',
                    color: '#92400e',
                    background: '#fef3c7',
                },
            });

            get().queueMessages(messageData);
            return;
        }

        set({ isMessageSending: true });

        const tempId = Date.now().toString();

        const { selectedUser } = get();
        // , messages

        // Optimistic UI update
        set(state => ({
            messages: [
                ...state.messages,
                {
                    ...messageData,
                    _id: tempId,
                    tempId: tempId,
                    status: 'sending',
                    createdAt: new Date().toISOString(),
                }
            ]
        }))

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser?._id}`, messageData);

            // Replace optimistic message with real one
            set(state => ({
                messages: state.messages.map(msg =>
                    msg.tempId === tempId ? { ...res.data.data, status: 'sent' } : msg
                )
            }));


        } catch (error) {
            toast.error('Error sending messages');

            set(state => ({
                messages: state.messages.map(msg =>
                    msg.tempId === tempId ? { ...msg, status: 'failed', error: 'Send failed' } : msg
                )
            }))

        } finally {
            set({ isMessageSending: false });
        }

    },

    retryMessages: async (message: messageStructure) => {
        const { selectedUser } = get();
        const authUser = useAuthStore.getState().authUser;

        if (!selectedUser) return;

        // Update status to retrying - use _id since it's not a temp message anymore
        set(state => ({
            messages: state.messages.map(msg =>
                msg._id === message._id
                    ? { ...msg, status: 'sending', retryCount: (msg.retryCount || 0) + 1 }
                    : msg
            )
        }));

        // Check if we're actually online
        const isOnline = await isServerReachable();

        if (!isOnline) {
            // We're offline - add to queue instead of failing
            const queuedMessage: QueuedMessage = {
                id: message._id, // Use existing ID
                receiverId: selectedUser._id,
                text: message.text,
                image: message.image,
                timestamp: Date.now(),
                retryCount: message.retryCount || 0
            };

            const queueKey = `messageQueue_${authUser?._id}`;
            const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
            const updatedQueue = [...existingQueue, queuedMessage];
            localStorage.setItem(queueKey, JSON.stringify(updatedQueue));

            // UI already shows "sending" - it will stay there until processed
            return;
        }

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, {
                text: message.text,
                image: message.image,
            });

            // Update with successful message - replace the entire message
            set(state => ({
                messages: state.messages.map(msg =>
                    msg._id === message._id ? { ...res.data.data, status: 'sent' } : msg
                )
            }));

        } catch (error) {
            // Mark as failed again
            set(state => ({
                messages: state.messages.map(msg =>
                    msg._id === message._id
                        ? { ...msg, status: 'failed', error: 'Retry failed' }
                        : msg
                )
            }));

            toast.error('Failed to resend message');
        }
    },

    // Queueing

    // Making queue
    queueMessages: (messageData: any) => {
        const { selectedUser } = get();
        const authUser = useAuthStore.getState().authUser;

        if (!selectedUser || !authUser) return;

        const queuedMessage: QueuedMessage = {
            id: Date.now().toString(),
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            timestamp: Date.now(),
            retryCount: 0,
        };

        set(state => ({
            messages: [
                ...state.messages,
                {
                    ...queuedMessage,
                    _id: queuedMessage.id,
                    status: 'sending',
                    createdAt: new Date().toISOString(),
                    senderId: authUser._id,
                    tempId: queuedMessage.id
                }
            ]
        }));
        const queueKey = `messageQueue_${authUser._id}`;
        const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
        const updatedQueue = [...existingQueue, queuedMessage];
        localStorage.setItem(queueKey, JSON.stringify(updatedQueue));
    },

    // processingQueue
    processQueueMsg: async () => {
        const authUser = useAuthStore.getState().authUser;
        // Queue Key
        const queueKey = `messageQueue_${authUser?._id}`;

        if (!authUser) return;
        const queue: QueuedMessage[] = JSON.parse(localStorage.getItem(queueKey) || '[]');

        for (const message of queue) {
            try {
                const isOnline = await isServerReachable();

                // Stop processing
                if (!isOnline) return;

                const { receiverId, text, image } = message;

                const res = await axiosInstance.post(`/message/send/${receiverId}`, { text, image });

                // Remove from queue on success
                const updatedQueue = queue.filter(q => q.id !== message.id);
                localStorage.setItem(queueKey, JSON.stringify(updatedQueue));

                // Update UI status
                set(state => ({
                    messages: state.messages.map(msg =>
                        msg._id === message.id ? { ...res.data.data, status: 'sent' } : msg
                    )
                }));


            } catch (error) {
                console.error('Failed to send queued message:', error);
                break;
            }
        }
    },

    clearQueue: () => {
        const authUser = useAuthStore.getState()?.authUser;
        if (!authUser) return;

        const queueKey = `messageQueue_${authUser._id}`;
        localStorage.removeItem(queueKey);
    },

    // Messages

    // Subscribe to messages
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