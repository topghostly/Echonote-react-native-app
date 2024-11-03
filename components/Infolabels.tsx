import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useColor } from "@/context/ColorProvider";
import AddButton from "./AddButton";

interface infoType {
  info: string;
  amount: number;
}
const Infolabels: React.FC<infoType> = ({ info, amount }) => {
  // Get our colors from the context
  const { colors } = useColor();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primaryOne,
        aspectRatio: 0.9,
        borderRadius: 20,
        padding: 15,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 25,
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontFamily: "Causten-Regular",
            fontSize: 16,
            flex: 1,
          }}
        >
          {info}
        </Text>
        <AddButton size={35} />
      </View>

      {/* Bottom section view */}

      <View
        style={{
          flexDirection: "row",
          flex: 1,
          gap: 5,
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 60,
            fontFamily: "Causten-Medium",
          }}
        >
          {amount}
        </Text>
        <Text
          style={{
            paddingTop: 15,
            opacity: 0.35,
          }}
        >
          Memos
        </Text>
      </View>
    </View>
  );
};

export default Infolabels;
