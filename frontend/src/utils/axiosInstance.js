// ✅ axiosInstance.js — Final, Production Ready
import axios from "axios";
import { API_BASE_URL } from "./apiPath";
import toast from "react-hot-toast";

/**
 * Axios instance configured for backend + AI endpoints
 * Features:
 *  - 60s timeout (suitable for AI resume generation)
 *  - Auto-retry (2x) for timeouts/network errors
 *  - Auto token attach (supports both "token" & "accessToken")
 *  - Graceful session expiration handling
 *  - Developer-friendly console warnings
 */

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const api = axiosInstance;

// ✅ REQUEST INTERCEPTOR — Attach Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    // Read token (works with both keys)
    const accessToken =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("⚠️ No token found in localStorage");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR — Handle errors, timeouts, retries
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const config = error.config;

    // --- Handle timeout or network errors ---
    if (
      error.code === "ECONNABORTED" ||
      error.message?.includes("timeout") ||
      error.message?.includes("Network Error")
    ) {
      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount < 2) {
        config.__retryCount += 1;
        console.warn(`⏱️ Timeout — retrying (${config.__retryCount}/2)...`);
        toast.loading("Network slow, retrying...", { id: "retry-toast" });
        return axiosInstance(config);
      } else {
        toast.dismiss("retry-toast");
        toast.error("Request timed out. Please try again later.");
        console.error("⏱️ Request failed after multiple retries");
      }
    }

    // --- Handle HTTP errors from backend ---
    if (error.response) {
      const status = error.response.status;
      const errorUrl = error.config?.url;

      console.warn(`⚠️ HTTP ${status} error on: ${errorUrl}`);

      switch (status) {
        case 400:
          toast.error("Bad request — please check your input.");
          break;

        case 401:
        case 403:
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          setTimeout(() => {
            window.location.href = "/";
          }, 800);
          break;

        case 404:
          console.error("❌ API route not found:", errorUrl);
          toast.error("API endpoint not found.");
          break;

        case 429:
          toast.error("Too many requests — please wait a moment.");
          break;

        case 500:
          console.error("💥 Server Error (500):", error.response.data);
          toast.error("Server error — please try again later.");
          break;

        default:
          console.warn("⚠️ Unhandled HTTP error:", status);
          toast.error("An unexpected error occurred.");
      }
    } else if (!error.response) {
      // --- Handle no response (CORS, DNS, offline) ---
      console.error("🌐 Network Error:", error.message);
      toast.error("Network issue. Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
