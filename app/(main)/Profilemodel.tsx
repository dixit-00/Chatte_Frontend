import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackButton from "@/components/BackBotton";
import { scale, verticalScale } from "@/utils/styling";
import Avatar from "@/components/Avatar";
import * as Icons from "phosphor-react-native";
import Typo from "../../components/typo";
import Input from "../../components/Input";
import { useAuth } from "../../context/authContext";
import { useState } from "react";
import { UserDataProps } from "@/types";
import { Button } from "@react-navigation/elements";
import Botton from "@/components/Botton";
import { useRouter } from "expo-router";
import { updateProfile } from "@/socket/socketEvents";
import * as ImagePicker from "expo-image-picker";
import { uploadFileToCloudinary } from "@/services/imageService";
const ProfileModal = () => {
  const { user, signOut, updateToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userData, setUserData] = useState<UserDataProps>({
    name: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    updateProfile(processUpdateProfile);

    return () => {
      updateProfile(processUpdateProfile, true);
    };
  }, []);

  const processUpdateProfile = (res: any) => {
    console.log("got res", res);
    setLoading(false);

    if (res.success) {
      updateToken(res.data.token);
      router.back();
    } else {
      Alert.alert("Error", res.msg);
    }
  };
  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar,
    });
  }, [user]);

  const onSubmit = async () => {
    let { name, avatar } = userData;
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setLoading(true);
    let data: { name: string; avatar?: string | null } = {
      name,
    };

    // Check if avatar is a new local file (object with uri) or already a Cloudinary URL (string)
    if (avatar && typeof avatar === "object" && avatar.uri) {
      // It's a new local file, upload to Cloudinary
      console.log("Uploading new image to Cloudinary...");
      const res = await uploadFileToCloudinary(avatar, "profiles");
      console.log("Cloudinary upload res", res);
      if (res.success && res.data) {
        data.avatar = res.data; // Use the Cloudinary URL
        console.log("Avatar uploaded successfully:", res.data);
      } else {
        setLoading(false);
        Alert.alert("Error", res.msg || "Failed to upload avatar");
        return;
      }
    } else if (avatar && typeof avatar === "string") {
      // Already a Cloudinary URL, use it as is
      data.avatar = avatar;
      console.log("Using existing Cloudinary URL:", avatar);
    } else {
      // No avatar or null, keep existing avatar
      data.avatar = avatar || null;
    }

    console.log("Sending update profile data:", data);
    updateProfile(data);
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    });
    console.log("Image picker result", result);

    if (!result.canceled && result.assets && result.assets[0]) {
      // Store the full asset object with uri property
      setUserData({ ...userData, avatar: { uri: result.assets[0].uri } });
    }
  };

  const handleLogout = async () => {
    router.back();
    await signOut();
  };
  const showLogoutAlert = () => {
    Alert.alert("confirm", "Are you sure you want to logout?:", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel logout"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };
  return (
    <ScreenWrapper isModal={true} showPattern={false}>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={
            Platform.OS == "android" && <BackButton color={colors.black} />
          }
          style={{ marginVertical: spacingY._15 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarcontainer}>
            <Avatar uri={userData.avatar} size={170} />

            <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
              <Icons.Pencil size={20} color={colors.neutral800} />
            </TouchableOpacity>
          </View>

          <View style={{ paddingLeft: spacingY._20 }}>
            <View style={styles.InputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>Email</Typo>

              <Input
                value={userData.email}
                containerStyle={{
                  borderColor: colors.neutral350,
                  paddingLeft: spacingX._20,
                  backgroundColor: colors.neutral300,
                }}
                onChangeText={(value) =>
                  setUserData({ ...userData, email: value })
                }
                editable={false}
              />
            </View>
          </View>
          <View style={{ paddingLeft: spacingY._20 }}>
            <View style={styles.InputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>Name</Typo>

              <Input
                value={userData.name}
                containerStyle={{
                  borderColor: colors.neutral350,
                  paddingLeft: spacingX._20,
                  // backgroundColor: colors.neutral300,
                }}
                onChangeText={(value) =>
                  setUserData({ ...userData, name: value })
                }
                // editable={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {!loading && (
          <Botton
            style={{
              width: verticalScale(56),
              height: verticalScale(56),
              backgroundColor: colors.rose,
            }}
            onPress={() => {
              showLogoutAlert();
            }}
          >
            <Icons.SignOut
              size={verticalScale(30)}
              color={colors.white}
              weight="bold"
            />
          </Botton>
        )}

        <Botton style={{ flex: 1 }} onPress={onSubmit} loading={loading}>
          <Typo size={20} color={colors.black} fontWeight="700">
            Update
          </Typo>
        </Botton>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarcontainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    textShadowOffset: { width: 0, height: 0 },
    borderRadius: 100,
    shadowRadius: 10,
    shadowOpacity: 0.25,
    elevation: 4,
    padding: spacingY._7,
  },
  InputContainer: {
    gap: spacingX._7,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,

    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral200,

    marginBottom: spacingY._10,
    borderTopWidth: 1,
  },
});
