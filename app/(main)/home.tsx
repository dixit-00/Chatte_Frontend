import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Typo from "../../components/typo";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/authContext";

const Home = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <ScreenWrapper>
      <Typo color={colors.white}>Home</Typo>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
