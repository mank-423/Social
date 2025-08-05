import { create } from 'zustand'
import { axiosInstance } from '../utils/axios'
import type { AuthStore } from '../types/store';
import type { LoginUser, userType } from '../types/auth';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
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
            set({ authUser: res.data });
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
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error in logout");
        }
    },

    logIn: async (data: LoginUser) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged In successfully");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            console.log('Error:', error);
            toast.error(err?.response?.data?.message || 'Error occured during signup');
        } finally {
            set({ isLoggingIn: false });
        }
    }
}))