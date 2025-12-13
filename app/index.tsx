import { useEffect, useRef, useState } from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import { colors } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [minSplashTimePassed, setMinSplashTimePassed] = useState(false);
  const hasNavigated = useRef(false);

  // Minimum splash screen duration (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashTimePassed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Navigate once both conditions are met: splash time passed AND auth check complete
  useEffect(() => {
    if (minSplashTimePassed && !isLoading && !hasNavigated.current) {
      hasNavigated.current = true;
      if (token) {
        // User is logged in, go to home
        router.replace("/(main)/home");
      } else {
        // User is not logged in, go to welcome
        router.replace("/(auth)/Welcome");
      }
    }
  }, [minSplashTimePassed, isLoading, token, router]);

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
