import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Screenwrapper from "../../components/ScreenWrapper";
import Typo from "@/components/typo";
import { colors, spacingX } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeInUp } from "react-native-reanimated";
import Botton from "@/components/Botton";
import { useRouter } from "expo-router";

const Welcome = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGetStarted = async () => {
    setLoading(true);
    // Simulate an async operation (e.g., navigation, API call, etc.)
    // Replace this with your actual logic
    setTimeout(() => {
      setLoading(false);
      // Add your navigation or other logic here
    }, 2000);
  };

  return (
    <Screenwrapper showPattern={true} bgOpacity={0.8}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Typo
            color={colors.white}
            size={45}
            fontWeight="900"
            style={{ marginBottom: 20 }}
          >
            Chatte
          </Typo>
        </View>
        <Animated.Image
          entering={FadeInUp.duration(700).springify()}
          source={require("../../assets/images/welcome.png")}
          style={styles.welcomeImage}
        />

        <View>
          <Typo color={colors.white} size={30} fontWeight={"800"}>
            Stay Connected
          </Typo>
          <Typo color={colors.white} size={30} fontWeight={"800"}>
            with your friends
          </Typo>
          <Typo color={colors.white} size={30} fontWeight={"800"}>
            and family
          </Typo>
        </View>
        <Botton
          style={{ width: "100%", backgroundColor: colors.white }}
          loading={loading}
          onPress={() => router.push("/(auth)/registerpage")}
        >
          <Typo color={colors.neutral900} size={23} fontWeight="bold">
            Get Started
          </Typo>
        </Botton>
      </View>
    </Screenwrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: spacingX._20,
    marginVertical: spacingX._10,
    alignItems: "center",
  },
  Background: {
    flex: 1,

    backgroundColor: colors.neutral900,
  },
  welcomeImage: {
    height: verticalScale(300),
    aspectRatio: 1,
    alignSelf: "center",
  },
});
