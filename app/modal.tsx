import { StatusBar } from "expo-status-bar";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import { useState } from "react";

export default function ModalScreen() {
  // Grab color from context provider
  const { colors } = useColor();

  // Set state for recording status
  const [isRecording, setIsRecording] = useState<boolean>(false);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      {/* Header part */}
      <View style={styles.headerContainer}>
        {/* Memo name input  */}
        <View style={styles.nameInputContainer}>
          <TextInput
            style={{
              flex: 1,
              fontFamily: "Causten-SemiBold",
              fontSize: 25,
              color: colors.primaryTwo,
            }}
            placeholder="Untitled Memo"
          />
        </View>
        <View style={styles.submitButtonHolder}>
          <TouchableOpacity
            style={{
              width: 50,
              aspectRatio: 1,
              backgroundColor: colors.text,
              borderRadius: 1000,
              borderCurve: "continuous",
              justifyContent: "center",
              alignItems: "center",
            }}
            // onPress={() => {
            //   router.push("/modal");
            // }}
          >
            <Image
              source={icons.check}
              style={{ tintColor: "white", width: 15, height: 15 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom part */}
      <View style={styles.bottomHolder}>
        <View style={styles.playButtonHolder}>
          <TouchableOpacity
            style={{
              width: 80,
              aspectRatio: 1,
              backgroundColor: isRecording ? "red" : "white",
              borderRadius: 1000,
              borderCurve: "continuous",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={icons.mic}
              style={{ tintColor: colors.text, width: 30, height: 30 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInputContainer: {
    height: 50,
    paddingHorizontal: 10,
    flex: 1,
  },
  submitButtonHolder: {
    width: 50,
  },

  // Bottom Styles
  bottomHolder: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  playButtonHolder: {
    width: 80,
  },
});
