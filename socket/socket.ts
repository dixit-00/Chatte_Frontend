import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
import { Platform } from "react-native";

let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;

export async function connectSocket(): Promise<Socket> {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }

  // If socket exists and is connected, return it
  if (socket?.connected) {
    console.log("[Socket] Already connected:", socket.id);
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  console.log(`[Socket] Connecting to: ${API_URL}`);

  socket = io(API_URL, {
    auth: {
      token: token,
    },
    // Important for Android - add transports and timeout settings
    transports: ["websocket", "polling"],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: MAX_RETRY_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    // Force new connection
    forceNew: true,
  });

  return new Promise((resolve, reject) => {
    const connectionTimeout = setTimeout(() => {
      console.error("[Socket] Connection timeout");
      socket?.disconnect();
      reject(new Error(`Socket connection timeout. Make sure your backend is running and accessible from ${Platform.OS}.`));
    }, 25000);

    socket?.on("connect", () => {
      clearTimeout(connectionTimeout);
      connectionAttempts = 0;
      console.log("[Socket] Connected successfully:", socket?.id);
      resolve(socket!);
    });

    socket?.on("connect_error", (err) => {
      connectionAttempts++;
      console.error(`[Socket] Connection error (attempt ${connectionAttempts}):`, err.message);
      
      if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
        clearTimeout(connectionTimeout);
        reject(new Error(`Socket connection failed after ${MAX_RETRY_ATTEMPTS} attempts: ${err.message}`));
      }
    });

    socket?.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    socket?.on("reconnect", (attemptNumber) => {
      console.log("[Socket] Reconnected after", attemptNumber, "attempts");
    });

    socket?.on("reconnect_error", (err) => {
      console.error("[Socket] Reconnection error:", err.message);
    });
  });
}

export function getSocket(): Socket | null {
  return socket;
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    connectionAttempts = 0;
    console.log("[Socket] Disconnected and cleaned up");
  }
}
