import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Set your API base URL
});

// Add an interceptor to include the token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
