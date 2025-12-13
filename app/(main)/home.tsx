import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Typo from "../../components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import Button from "@/components/Botton";
import { testSocket } from "@/socket/socketEvents";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import { verticalScale } from "@/utils/styling";

const Home = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    testSocket(testSocketCallbackHandler);
    testSocket(null);

    return () => {
      testSocket(testSocketCallbackHandler, true);
    };
  }, []);

  const testSocketCallbackHandler = (data: any) => {
    console.log("got reponse  ", data);
  };
  console.log(user);
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <View style={styles.container}>
        <View style={styles.Header}>
          <View style={{ flex: 1 }}>
            <Typo
              color={colors.neutral200}
              size={19}
              textProps={{ numberOfLines: 1 }}
            >
              Welcome back,
              <Typo size={20} color={colors.white} fontWeight={800}>
                {" "}
                {user?.name}
              </Typo>{" "}
              👍
            </Typo>
          </View>
          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => router.push("/(main)/Profilemodel")}
          >
            <Icons.GearSix
              color={colors.white}
              weight="fill"
              size={verticalScale(22)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}></View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  Header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",

    paddingHorizontal: spacingX._10,
    paddingTop: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  form: {
    gap: spacingY._15,
    marginTop: spacingY._20,
  },
  footer: {
    marginBottom: spacingY._30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
