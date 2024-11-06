import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { memo, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import Infolabels from "@/components/Infolabels";
import AddButton from "@/components/AddButton";
import Memos from "@/components/Memos";
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
              fontSize: 55,
            }}
          >
            Beaver
          </Text>
        </View>
        <AddButton size={55} />
      </View>
      <ScrollView
        style={styles.scrollHolder}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoHolder}>
          <Infolabels info="Total saved voice memo" amount={7} />
          <Infolabels info="Total favorite voice memo" amount={0} />
        </View>

        {/* Memo list */}

        <View style={styles.memoListHolder}>
          <View
            style={{
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Causten-SemiBold",
                fontSize: 20,
              }}
            >
              Memo List
            </Text>
          </View>

          {/* Map all the momo components */}
          <View
            style={{
              flex: 1,
              gap: 5,
            }}
          >
            <Memos />
            <Memos />
            <Memos />
            <Memos />
            <Memos />
            <Memos />
            <Memos />
            <Memos />
          </View>
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
    paddingTop: 20,
    paddingBottom: 10,
  },

  infoHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 15,
  },

  memoListHolder: {
    paddingVertical: 15,
  },
});
