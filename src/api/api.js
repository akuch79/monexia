// src/api/api.js
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token automatically to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ── Auth helpers ──────────────────────────────────────────────

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
};

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ── Auth API calls ────────────────────────────────────────────

// Login user
export const login = async (email, password) => {
  try {
    const res = await API.post("/auth/login", { email, password });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    
    // Flexible user saving
    const userData = res.data.user || { name: res.data.name, email: res.data.email };
    if (userData.email) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    
    return res.data;
  } catch (err) {
    console.error("Login Error Details:", err.response?.data);
    throw err.response?.data || { message: "Login failed" };
  }
};

// Signup user - Updated to handle the 500 error better
export const signup = async (name, email, password) => {
  try {
    // We send a clean object to ensure the backend receives exactly what it needs
    const res = await API.post("/auth/signup", { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password: password 
    });

    // Handle successful response
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    
    // Some backends return 'user', others return flat data. This handles both:
    const userToSave = res.data.user || { name: res.data.name, email: res.data.email };
    if (userToSave.name) {
      localStorage.setItem("user", JSON.stringify(userToSave));
    }

    return res.data;
  } catch (err) {
    // This logs the actual error from the Node.js server to your browser console
    console.error("CRITICAL SIGNUP ERROR:", err.response?.data || err.message);
    
    // Throw the specific error message from the backend if it exists
    throw err.response?.data || { message: "Signup failed: Server Error (500)" };
  }
};

// ── User / Profile ────────────────────────────────────────────

export const getProfile = async (userId) => {
  try {
    const res = await API.get(`/auth/profile/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch profile" };
  }
};

export const updateProfile = async (userId, data) => {
  try {
    const res = await API.put(`/auth/profile/${userId}`, data);
    if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update profile" };
  }
};

// ── Transactions ──────────────────────────────────────────────

export const getTransactions = async () => {
  try {
    const res = await API.get("/transactions");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch transactions" };
  }
};

export const addTransaction = async (data) => {
  try {
    const res = await API.post("/transactions", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to add transaction" };
  }
};

export const deleteTransaction = async (id) => {
  try {
    const res = await API.delete(`/transactions/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete transaction" };
  }
};

export default API;