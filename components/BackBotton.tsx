import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { colors as colours } from "@/constants/theme";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { CaretLeft } from "phosphor-react-native";

const BackBotton = ({
  style,
  iconSize = 24,
  color = colours.white,
}: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style]}
    >
      <CaretLeft size={iconSize} color={color} weight="bold" />
    </TouchableOpacity>
  );
};

export default BackBotton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
