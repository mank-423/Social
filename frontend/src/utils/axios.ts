import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/useAuthStore';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

// Response interceptor for catching all 401's and refresh token at common place
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

function addSubscriber(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // Don't intercept refresh itself
        if (originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                const { refresh, logOut } = useAuthStore.getState();

                try {
                    const newToken = await refresh();
                    if (newToken) {
                        onTokenRefreshed(newToken);
                    } else {
                        logOut();
                        return Promise.reject(error);
                    }
                } catch (err) {
                    logOut();
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve) => {
                addSubscriber((token: string) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(axiosInstance(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);
