// src/utils/api.js
import axios from "axios";
import API from "../config/api";

// Create an Axios instance for centralized API calls
const api = axios.create({
  baseURL: API.BASE_URL, // This will be your backend base URL from config
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
