import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import { TypoProps } from "../types";
import { colors } from "../constants/theme";

const typo = ({
    size = 16,
    color = colors.text,
    fontWeight = "400",
    children,
    style,
    textProps = {}
}: TypoProps) => {
    const textStyle = {
        fontSize: verticalScale(size),
        color,
        fontWeight,
    };
    
    return (
        <Text style={[textStyle, style]} {...textProps}>
            {children}
        </Text>
    );
};

export default typo;

const styles = StyleSheet.create({});
