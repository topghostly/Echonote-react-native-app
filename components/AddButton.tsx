import { Image, TouchableOpacity, Text } from "react-native";
import React from "react";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import { router } from "expo-router";

// Input props interface
interface buttonType {
  size: number;
}

const AddButton: React.FC<buttonType> = ({ size }) => {
  // Get our colors from the context
  const { colors } = useColor();

  return (
    <TouchableOpacity
      style={{
        width: size,
        aspectRatio: 1,
        backgroundColor: colors.text,
        borderRadius: 1000,
        borderCurve: "continuous",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
      onPress={() => {
        router.push("/modal");
      }}
    >
      <Image
        source={icons.add}
        style={{ tintColor: "white", width: size / 2, height: size / 2 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default AddButton;
