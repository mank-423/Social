import { create } from 'zustand'
import { axiosInstance } from '../utils/axios'
import type { AuthStore } from '../types/store';
import type { LoginUser, UpdateUser, userType } from '../types/auth';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { io } from "socket.io-client"

const baseURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const useAuthStore = create<AuthStore>((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data.data });
            get().connectSocket();
        } catch (error) {
            console.log('Error in checking auth:', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp: async (data: userType) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            console.log("Response signin:", res.data);
            set({ authUser: res.data.data });
            get().connectSocket();
            toast.success("Account created successfully");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            console.log('Error:', error);
            toast.error(err?.response?.data?.message || 'Error occured during signup');
        } finally {
            set({ isSigningUp: false });
        }
    },

    logOut: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            get().disconnectSocket();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error in logout");
        }
    },

    logIn: async (data: LoginUser) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.user });
            toast.success("Logged In successfully");
            get().connectSocket();
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            console.log('Error:', error);
            toast.error(err?.response?.data?.message || 'Error occured during login');
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data: UpdateUser) => {
        try {
            set({ isUpdatingProfile: true });
            const res = await axiosInstance.post("/auth/update-profile", data);
            const newUserData = res.data.data;
            set({ authUser: newUserData });
            toast.success("Profile updated!");
        } catch (error) {
            toast.error('Error in profile update!');
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        // Optimization: if already authenticated and already connected
        if (!authUser || get().socket?.connected) return;

        const socket = io(baseURL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });
        
        socket.on("getOnlineUsers", (userIds: Array<string>) => {
            set({onlineUsers: userIds})
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected){
            get().socket?.disconnect();
        }
     },
}))