import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }

  if (!socket) {
    socket = io(API_URL, {
      auth: {
        token: token,
      },
    });

    await new Promise((resolve) => {
      socket?.on("connect", () => {
        console.log("Socket connected:", socket?.id);
        resolve(true);
      });
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
}
