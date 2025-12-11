import { useEffect } from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import { colors } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/(auth)/Welcome" as never);
    }, 2000);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />

      {/* Force fullscreen background */}

      <Animated.Image
        source={require("../assets/images/splashImage.png")}
        entering={FadeInDown.duration(1000)}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "23%",
    aspectRatio: 1,
  },
});
