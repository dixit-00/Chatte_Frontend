import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { login, register } from "@/services/authServices";
import { connectSocket, disconnectSocket } from "@/socket/socket";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<UserProps | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem("authToken");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedTokenProps>(storedToken);

        if (decoded.exp * 1000 > Date.now() && decoded.exp) {
          await AsyncStorage.setItem("authToken", storedToken);
          gotoWelcomeScreen();
          return;
        }
        setToken(storedToken);
        setUser(decoded.user);
        gotoHomescreen();
      } catch (error) {
        gotoWelcomeScreen();
        console.error("Error decoding stored token:", error);
      }
    } else {
      gotoWelcomeScreen();
    }
  };

  const gotoHomescreen = () => {
    setTimeout(() => {
      router.replace("/(main)/home");
    }, 1500);
  };

  const gotoWelcomeScreen = () => {
    setTimeout(() => {
      router.replace("/(auth)/Welcome");
    }, 1500);
  };

  React.useEffect(() => {
    loadToken();
  }, []);
  const updateToken = async (token: string) => {
    try {
      if (token) {
        setToken(token);
        await AsyncStorage.setItem("authToken", token);

        const decoded = jwtDecode<DecodedTokenProps>(token);
        console.log("Decoded token:", decoded);

        // Add this check
        if (decoded && decoded.user) {
          setUser(decoded.user);
        } else {
          console.error("Invalid token structure:", decoded);
          // Handle invalid token - maybe sign out
          await signOut();
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      await signOut();
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      await updateToken(response.token);
      
      // Try to connect socket, but don't block login if it fails
      try {
        await connectSocket();
      } catch (socketError) {
        console.warn("[Auth] Socket connection failed, will retry later:", socketError);
      }
      
      router.replace("/(main)/home");
    } catch (error: any) {
      console.error("[Auth] Sign in failed:", error.message);
      throw error; // Re-throw so UI can show the error
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    avatar?: string | null
  ) => {
    try {
      // First register
      await register(name, email, password, avatar);

      // Then auto-login
      const response = await login(email, password);
      await updateToken(response.token);
      
      // Try to connect socket, but don't block signup if it fails
      try {
        await connectSocket();
      } catch (socketError) {
        console.warn("[Auth] Socket connection failed, will retry later:", socketError);
      }
      
      router.replace("/(main)/home");
    } catch (error: any) {
      console.error("[Auth] Sign up error:", error.message);
      throw error; // Re-throw so UI can show the error
    }
  };
  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("authToken");
    disconnectSocket();
    router.replace("/(auth)/Welcome");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
