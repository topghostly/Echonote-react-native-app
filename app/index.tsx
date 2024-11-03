import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColor } from "@/context/ColorProvider";

// Typescript interfaces and types import
import { colorScheme } from "@/context/ColorProvider";
const index = () => {
  // Collect color values from context
  const { colors, theme, toggleTheme } = useColor();

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.backgroundColor,
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      <ScrollView style={styles.scrollHolder}>
        <View style={styles.headerHolder}>
          <View style={styles.userNameHolder}>
            <Text
              style={{
                color: colors.text,
                fontFamily: "Causten-Bold",
                fontSize: 65,
              }}
            >
              Beaver
            </Text>
          </View>
          <View
            style={{
              width: 65,
              aspectRatio: 1,
              backgroundColor: colors.text,
              borderRadius: 200,
              borderCurve: "continuous",
            }}
          ></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  headerHolder: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  scrollHolder: {
    paddingTop: 20,
  },
  userNameHolder: {},
});
