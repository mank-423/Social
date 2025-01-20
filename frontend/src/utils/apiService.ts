import axios, { AxiosInstance } from "axios";

// You can define a base URL for all the requests if needed
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",  // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility to handle API calls
const apiService = {
  get: async (url: string) => {
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      // Handle error (logging, throwing error, etc.)
      console.error(error);
      throw error;
    }
  },

  post: async (url: string, data: object) => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  put: async (url: string, data: object) => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default apiService;
