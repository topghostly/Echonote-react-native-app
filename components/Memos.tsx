import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";

// The play audio button components
const PlayButton: React.FC = () => {
  const { colors } = useColor();
  return (
    <TouchableOpacity
      style={{
        height: 74,
        aspectRatio: 1,
        backgroundColor: "white",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={icons.play}
        style={{
          width: 30,
          height: 30,
          tintColor: colors.text,
        }}
      />
    </TouchableOpacity>
  );
};

// The open options components
const OptionsButton: React.FC = () => {
  const { colors } = useColor();
  return (
    <TouchableOpacity
      style={{
        height: 74,
        aspectRatio: 1,
        backgroundColor: colors.primaryOne,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={icons.options}
        style={{
          width: 30,
          height: 30,
          tintColor: colors.text,
        }}
      />
    </TouchableOpacity>
  );
};

const Memos: React.FC = () => {
  // Get colors from context
  const { colors } = useColor();
  return (
    <View
      style={{
        backgroundColor: colors.text,
        height: 80,
        borderRadius: 100,
        padding: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <PlayButton />
      <View style={styles.infoBlock}>
        <Text style={styles.memoName} numberOfLines={1}>
          MEMO_2024557729010930_948949
        </Text>
        <Text style={styles.memoDate} numberOfLines={1}>
          Tuesday, 23 Aug
        </Text>
      </View>
      <OptionsButton />
    </View>
  );
};

export default Memos;

const styles = StyleSheet.create({
  infoBlock: {
    flex: 1,
    padding: 8,
    gap: 4,
  },
  memoName: {
    color: "white",
    fontSize: 20,
    fontFamily: "Causten-SemiBold",
  },
  memoDate: {
    color: "#949494",
  },
});
