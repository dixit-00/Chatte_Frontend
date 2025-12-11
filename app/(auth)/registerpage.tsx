import {
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  View,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import Screenrapper from "../../components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useRouter } from "expo-router";
import BackBotton from "@/components/BackBotton";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Botton";
import Typo from "@/components/typo";
import { ScrollView } from "react-native";
import Input from "@/components/Input";
import { Alert } from "react-native";
import { verticalScale } from "@/utils/styling";
import { useAuth } from "@/context/authContext";

const registerpage = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();
  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign up", "Please fill all the fields!");
      return;
    }
    try {
      setIsLoading(true);
      await signUp(nameRef.current, emailRef.current, passwordRef.current);
    } catch (error: any) {
      Alert.alert(
        "Sign up",
        error.message || "An error occurred during sign up."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Screenrapper showPattern={true} bgOpacity={0.8}>
        <View style={styles.container}>
          <View style={styles.Header}>
            <BackBotton iconSize={25} />
            <Typo color={colors.white} size={24} fontWeight="700">
              Need some Help?
            </Typo>
          </View>
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: spacingY._15, marginBottom: spacingY._15 }}>
                <Typo size={28} fontWeight="600">
                  Getting Started
                </Typo>
                <Typo color={colors.neutral600}>
                  Create an acoount to continue!
                </Typo>
              </View>
              <Input
                placeholder="Enter your name"
                onChangeText={(value: string) => (nameRef.current = value)}
                icon={
                  <Icons.User
                    size={verticalScale(20)}
                    color={colors.neutral600}
                  />
                }
              />
              <Input
                placeholder="Enter your email"
                onChangeText={(value: string) => (emailRef.current = value)}
                icon={
                  <Icons.At
                    size={verticalScale(20)}
                    color={colors.neutral600}
                  />
                }
              />
              <Input
                placeholder="Enter your Password"
                secureTextEntry={true}
                onChangeText={(value: string) => (passwordRef.current = value)}
                icon={
                  <Icons.Lock
                    size={verticalScale(20)}
                    color={colors.neutral600}
                  />
                }
              />

              <View style={{ marginBottom: spacingY._30, gap: spacingY._15 }}>
                <Button loading={isLoading} onPress={handleSubmit}>
                  <Typo color={colors.neutral900} size={20} fontWeight="bold">
                    Sign Up
                  </Typo>
                </Button>
                <View style={styles.footer}>
                  <Typo color={colors.neutral600} size={14}>
                    Already have an account?
                  </Typo>
                  <Pressable onPress={() => router.push("/(auth)/loginPage")}>
                    <Typo
                      color={colors.primaryDark}
                      size={14}
                      fontWeight="bold"
                    >
                      Log In
                    </Typo>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Screenrapper>
    </KeyboardAvoidingView>
  );
};

export default registerpage;

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
