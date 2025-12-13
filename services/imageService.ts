import { ClOUDINARY_CLOUD_NAME, ClOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseProps } from "@/types";
import axios from "axios";

const ClOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${ClOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseProps> => {
  try {
    if (!file) return { success: true, data: null };

    if (typeof file === "string") return { success: true, data: file };

    if (file && file.uri) {
      const formData = new FormData();

      formData.append("file", {
        uri: file?.uri,
        type: "image/jpeg",
        name: file?.uri?.split("/").pop() || "file.jpg",
      } as any);

      formData.append("upload_preset", ClOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      const response = await axios.post(ClOUDINARY_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        data: response?.data?.secure_url,
      };
    } else {
      return {
        success: true,
        data: null,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Error uploading file",
    };
  }
};
export const getAvatarPath = (file: any, isGroup = false) => {
  if (file && typeof file === "string") return file;

  if (file && typeof file === "object") return file.uri;

  if (isGroup) return require("../assets/images/defaultGroupAvatar.png");

  return require("../assets/images/defaultAvatar.png");
};
