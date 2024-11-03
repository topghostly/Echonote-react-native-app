import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useColor } from "@/context/ColorProvider";

const Infolabels: React.FC = () => {
  // Get our colors from the context
  const { colors } = useColor();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primaryOne,
        aspectRatio: 0.9,
        borderRadius: 20,
        padding: 20,
      }}
    >
      <Text>Infolabels</Text>
    </View>
  );
};

export default Infolabels;
