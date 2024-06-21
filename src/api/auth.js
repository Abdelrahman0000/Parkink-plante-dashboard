// src/api/auth.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Proxy endpoint
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Backend error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("Network error:", error.message);
    } else {
      // Something happened in setting up the request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    const response = await api.post("/Accounts/Login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
export const fetchUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error;
  }
};
