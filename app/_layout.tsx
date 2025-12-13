import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(main)/Profilemodel"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(main)/NewConversation"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};
const RootLayout = () => {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
