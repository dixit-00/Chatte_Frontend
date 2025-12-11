import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ButtonProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Loading from "./Loading";

const Botton = ({ style, onPress, children, loading = false }: ButtonProps) => {
  if (loading) {
    return (
      <View style={[styles.button, styles.loadingButton, style]}>
        <Loading size="small" color={colors.primaryDark} />
      </View>
    );
  }
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {typeof children === 'string' ? (
        <Text style={styles.buttonText}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Botton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    borderCurve: "continuous",
    height: verticalScale(56),
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
  },
  loadingButton: {
    backgroundColor: colors.primary,
    opacity: 0.8,
  },
  buttonText: {
    color: colors.neutral900,
    fontSize: verticalScale(16),
    fontWeight: "600",
  },
});
