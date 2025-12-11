import axios from "axios";
import { API_URL } from "../constants";

export const login = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error logging in user:", error.message || error);
    throw error;
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  avatar: string | null = null
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      avatar,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error registering user:", error.message || error);
    throw error;
  }
};
