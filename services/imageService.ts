import { ClOUDINARY_CLOUD_NAME, ClOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseProps } from "@/types";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";

const ClOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${ClOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: { uri?: string; mimeType?: string; width?: number; height?: number; fileSize?: number } | string,
  folderName: string
): Promise<ResponseProps> => {
  try {
    if (!file) return { success: true, data: null };

    if (typeof file === "string") return { success: true, data: file };

    if (file && file.uri) {
      let imageUri = file.uri;
      let mimeType = file.mimeType || "image/jpeg";

      // Always resize and compress images to reduce upload time
      // Max 1200px on longest side, compress to 0.7 quality
      try {
        console.log(`Processing image: ${file.width}x${file.height}, size: ${file.fileSize || 'unknown'} bytes`);
        
        const maxDimension = 1200;
        let targetWidth = file.width;
        let targetHeight = file.height;
        
        // Always compress and resize if dimensions are provided
        // This significantly reduces upload time
        if (file.width && file.height) {
          // Calculate new dimensions maintaining aspect ratio
          if (file.width > file.height) {
            if (file.width > maxDimension) {
              targetWidth = maxDimension;
              targetHeight = Math.round((file.height * maxDimension) / file.width);
            }
          } else {
            if (file.height > maxDimension) {
              targetHeight = maxDimension;
              targetWidth = Math.round((file.width * maxDimension) / file.height);
            }
          }
          
          // Always compress even if not resizing to reduce file size
          const needsResize = targetWidth !== file.width || targetHeight !== file.height;
          
          if (needsResize) {
            console.log(`Resizing image to ${targetWidth}x${targetHeight}...`);
          } else {
            console.log(`Compressing image (keeping ${targetWidth}x${targetHeight})...`);
          }
          
          const manipResult = await ImageManipulator.manipulateAsync(
            file.uri,
            needsResize ? [
              {
                resize: {
                  width: targetWidth,
                  height: targetHeight,
                },
              },
            ] : [], // Just compress if no resize needed
            {
              compress: 0.6, // Higher compression (0.6) for smaller file size and faster upload
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );
          
          imageUri = manipResult.uri;
          mimeType = "image/jpeg";
          console.log(`Image processed successfully to ${manipResult.width}x${manipResult.height}`);
        } else {
          // If dimensions not provided, still compress the image
          console.log("Compressing image (dimensions unknown)...");
          const manipResult = await ImageManipulator.manipulateAsync(
            file.uri,
            [],
            {
              compress: 0.6,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );
          imageUri = manipResult.uri;
          mimeType = "image/jpeg";
          console.log("Image compressed successfully");
        }
      } catch (resizeError) {
        console.log("Failed to resize image, using original:", resizeError);
        // Continue with original image if resize fails
      }

      const formData = new FormData();

      // React Native FormData format
      formData.append("file", {
        uri: imageUri,
        type: mimeType,
        name: file?.uri?.split("/").pop() || "file.jpg",
      } as any);

      formData.append("upload_preset", ClOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      console.log("Uploading to Cloudinary...");
      
      // Create axios instance with increased timeout
      const axiosConfig = axios.create({
        timeout: 120000, // 120 seconds (2 minutes) timeout for large images
      });
      
      // Don't set Content-Type header - React Native FormData handles it automatically
      const response = await axiosConfig.post(ClOUDINARY_API_URL, formData, {
        headers: {
          Accept: "application/json",
          // Let axios set Content-Type automatically with boundary
        },
      });
      
      console.log("Upload successful:", response?.data?.secure_url);

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
  } catch (err: any) {
    console.log("Cloudinary upload error:", err);
    console.log("Error details:", {
      message: err?.message,
      response: err?.response?.data,
      status: err?.response?.status,
    });
    return {
      success: false,
      msg: err?.response?.data?.error?.message || err?.message || "Error uploading file",
    };
  }
};
export const getAvatarPath = (file: any, isGroup = false) => {
  if (file && typeof file === "string") return file;

  if (file && typeof file === "object") return file.uri;

  if (isGroup) return require("../assets/images/defaultGroupAvatar.png");

  return require("../assets/images/defaultAvatar.png");
};
