import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

const Loading = ({
  size = "large",
  color = colors.primaryDark,
  style,
}: ActivityIndicatorProps & { style?: any }) => {
  return (
    <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
