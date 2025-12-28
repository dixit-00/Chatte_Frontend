import { Platform } from "react-native";
import Constants from "expo-constants";

// =============================================================================
// IMPORTANT: SET YOUR COMPUTER'S IP ADDRESS HERE FOR PHYSICAL DEVICE TESTING
// =============================================================================
// To find your IP:
// - Mac: System Preferences > Network > Wi-Fi > IP Address
// - Or run in terminal: ipconfig getifaddr en0
// - Windows: ipconfig in command prompt, look for IPv4 Address
// =============================================================================
const DEV_MACHINE_IP = "192.168.1.100"; // <-- CHANGE THIS TO YOUR COMPUTER'S IP

// Set to true if testing on a physical Android device
const IS_PHYSICAL_DEVICE = !Constants.isDevice ? false : Platform.OS === "android";

const getApiUrl = () => {
  // For Android Emulator: use 10.0.2.2 (maps to host machine's localhost)
  // For Physical Android Device: use your computer's IP address
  // For iOS Simulator/Device: use localhost (iOS can resolve localhost properly)
  
  if (Platform.OS === "android") {
    // Check if running on physical device or emulator
    // expo-constants isDevice is true for physical devices
    if (Constants.isDevice) {
      // Physical Android device - use your machine's IP
      return `http://${DEV_MACHINE_IP}:3000`;
    }
    // Android Emulator - use special IP that maps to localhost
    return "http://10.0.2.2:3000";
  }
  
  // iOS can use localhost
  return "http://localhost:3000";
};

export const API_URL = getApiUrl();

// For debugging - log which URL is being used
if (__DEV__) {
  console.log(`[API] Platform: ${Platform.OS}, isDevice: ${Constants.isDevice}`);
  console.log(`[API] Using API URL: ${API_URL}`);
}

export const ClOUDINARY_CLOUD_NAME = "dwhpbmhyg";
export const ClOUDINARY_UPLOAD_PRESET = "images";
