import { create } from 'zustand'
import { axiosInstance } from '../utils/axios'
import type { AuthStore } from '../types/store';

export const useAuthStore = create<AuthStore>((set)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,


    checkAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser: res.data});
        } catch (error) {
            console.log('Error in checking auth:', error);
            set({authUser: null});
        } finally{
            set({isCheckingAuth: false})
        }
    }
}))