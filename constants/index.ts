import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2.3000" : "http://localhost:3000";

export const ClOUDINARY_CLOUD_NAME = "dwhpbmhyg";
export const ClOUDINARY_UPLOAD_PRESET = "images";
