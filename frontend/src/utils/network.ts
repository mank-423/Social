import { axiosInstance } from "./axios";

export async function isServerReachable() {

    if (!navigator.onLine) return false;

    try {
        const res = await axiosInstance.get('/ping');

        if (res.data.status === true) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Server ping failed:", error);
        return false;
    }
}