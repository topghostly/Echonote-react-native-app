import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useColor } from "@/context/ColorProvider";

// The play audio button components
const PlayButton: React.FC = () => {
  return (
    <TouchableOpacity
      style={{
        height: 74,
        aspectRatio: 1,
        backgroundColor: "white",
        borderRadius: 100,
      }}
    ></TouchableOpacity>
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
      }}
    ></TouchableOpacity>
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
      <View></View>
      <OptionsButton />
    </View>
  );
};

export default Memos;

const styles = StyleSheet.create({});
