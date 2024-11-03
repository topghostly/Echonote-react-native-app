import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import Infolabels from "@/components/Infolabels";
import AddButton from "@/components/AddButton";
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
      <View style={styles.headerHolder}>
        <View>
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
        <AddButton size={60} />
      </View>
      <ScrollView style={styles.scrollHolder}>
        <View style={styles.infoHolder}>
          <Infolabels />
          <Infolabels />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  scrollHolder: {
    paddingTop: 10,
  },
  headerHolder: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 20,
  },
  infoHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
