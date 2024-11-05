import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useColor } from "@/context/ColorProvider";
import { startRecording, stopRecording } from "../utilities/handleRecording";

const RecordPage = () => {
  const { colors } = useColor();
  return (
    <View style={styles.container}>
      <Text>RecordPage</Text>
    </View>
  );
};

export default RecordPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
