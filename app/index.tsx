import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorProvider } from "@/context/ColorProvider";
import { useColor } from "@/context/ColorProvider";

// Typescript interfaces and types import
import { colorScheme } from "@/context/ColorProvider";
const index = () => {
  // Collect color values from context
  const { colors, theme, toggleTheme } = useColor();

  // Using memo to avoid recalculating styles on rerender
  const styles: any = useMemo(() => {
    dynamicStyles(colors);
  }, [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>{colors.text}</Text>
    </SafeAreaView>
  );
};

export default index;

const dynamicStyles = (colors: colorScheme) => {
  StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundColor,
    },
  });
};
