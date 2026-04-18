// src/api/api.js
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://monexiabackend.onrender.com/api",
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

// Signup user
export const signup = async (name, email, password) => {
  try {
    const res = await API.post("/auth/signup", {
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password: password,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    const userToSave = res.data.user || { name: res.data.name, email: res.data.email };
    if (userToSave.name) {
      localStorage.setItem("user", JSON.stringify(userToSave));
    }

    return res.data;
  } catch (err) {
    console.error("CRITICAL SIGNUP ERROR:", err.response?.data || err.message);
    throw err.response?.data || { message: "Signup failed: Server Error (500)" };
  }
};

// Forgot password — request reset link
export const forgotPassword = async (email) => {
  try {
    const res = await API.post("/auth/forgot-password", {
      email: email.trim().toLowerCase(),              
    });
    return res.data;                                  
  } catch (err) {
    console.error("Forgot Password Error:", err.response?.data);
    throw err.response?.data || { message: "Failed to send reset link" };
  }
};

// Reset password — submit new password with token
export const resetPassword = async (token, password) => {
  try {
    const res = await API.post(`/auth/reset-password/${token}`, { password });

    // ✅ Auto-login after reset — save token and user if returned
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    if (res.data.name || res.data.email) {
      localStorage.setItem("user", JSON.stringify({
        name:  res.data.name,
        email: res.data.email,
      }));
    }

    return res.data;                                  // returns { message, token, name, email }
  } catch (err) {
    console.error("Reset Password Error:", err.response?.data);
    throw err.response?.data || { message: "Failed to reset password" };
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
    const res = await API.post("/transactions", {
      description: data.description,
      amount:      Number(data.amount),
      type:        data.type,
      category:    data.category || "General",
      phone:       data.phone    || "",
      date:        data.date     || new Date(),
    });
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