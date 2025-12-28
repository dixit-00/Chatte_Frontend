import axios, { AxiosError } from "axios";
import { API_URL } from "../constants";
import { Platform } from "react-native";

// Configure axios defaults for better Android compatibility
axios.defaults.timeout = 15000; // 15 second timeout

// Helper to get better error messages
const getErrorMessage = (error: AxiosError | any): string => {
  if (error.code === "ECONNABORTED") {
    return "Request timeout. Please check your connection.";
  }
  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return Platform.OS === "android"
      ? "Network error. Make sure: 1) Backend is running, 2) Your IP address is correct in constants/index.ts, 3) Both devices are on the same WiFi network."
      : "Network error. Make sure the backend server is running.";
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || "An unknown error occurred";
};

export const login = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  try {
    console.log(`[Auth] Attempting login to: ${API_URL}/auth/login`);
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    console.log("[Auth] Login successful");
    return response.data;
  } catch (error: any) {
    const errorMsg = getErrorMessage(error);
    console.error("[Auth] Login error:", errorMsg);
    throw new Error(errorMsg);
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  avatar: string | null = null
): Promise<{ message: string }> => {
  try {
    console.log(`[Auth] Attempting registration to: ${API_URL}/auth/register`);
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      avatar,
    });
    console.log("[Auth] Registration successful");
    return response.data;
  } catch (error: any) {
    const errorMsg = getErrorMessage(error);
    console.error("[Auth] Registration error:", errorMsg);
    throw new Error(errorMsg);
  }
};
