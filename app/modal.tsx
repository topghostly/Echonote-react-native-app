import { StatusBar } from "expo-status-bar";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import { useState, useEffect } from "react";
import AudioRecord from "react-native-audio-record";
import { PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";
import RNFS from "react-native-fs";

export default function ModalScreen() {
  // Grab color from context provider
  const { colors } = useColor();

  // Set state for recording status
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [amplitude, setAmplitude] = useState(0); // State to hold amplitude level

  // Calculate the amplitude from the buffer
  const calculateAmplitude = (buffer: any) => {
    let sum = 0;
    for (let i = 0; i < buffer.length; i += 2) {
      const value = buffer.readInt16LE(i);
      sum += Math.abs(value);
    }
    return sum / (buffer.length / 2); // Average amplitude
  };

  // Request for permission to use the mocrophone
  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "This app needs access to your microphone to record audio.",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Initialise and configure recording parameter
  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  useEffect(() => {
    console.log(amplitude);
  }, [amplitude]);

  const startRecording = () => {
    // Configure AudioRecord
    AudioRecord.init({
      sampleRate: 16000, // Audio frequency (adjust as needed)
      channels: 1, // Mono channel
      bitsPerSample: 16,
      audioSource: 6, // Microphone
      wavFile: "temp-voice-message.wav",
    });

    // Listener for real-time data
    AudioRecord.on("data", (data) => {
      const buffer = Buffer.from(data, "base64");
      const currentAmplitude = calculateAmplitude(buffer);
      setAmplitude(currentAmplitude); // Update amplitude level
    });

    // Start recording logic
    try {
      setIsRecording(true);
      AudioRecord.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      const uri = AudioRecord.stop();
      console.log(uri);
      // const newPath = `${RNFS.DocumentDirectoryPath}/voice-message.wav`;

      // try {
      //   await RNFS.moveFile(uri, newPath);
      //   console.log("File moved to:", newPath);
      // } catch (error) {
      //   console.error("Error moving file:", error);
      // }
      setAmplitude(0); // set amplitude back to 0
    } catch (error) {
      console.error("Error stopping recording:", error);
      setAmplitude(0);
    }
    setAmplitude(0);
  };

  // Handle record button onpress
  const handleRecordFunction = () => {
    if (isRecording) {
      stopRecording();
      console.log("Recording stopped");
    }
    if (!isRecording) {
      startRecording();
      console.log("Recording started");
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
        padding: 10,
        paddingTop: 20,
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
              width: 90,
              aspectRatio: 1,
              backgroundColor: isRecording ? "red" : "white",
              borderRadius: 1000,
              borderCurve: "continuous",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 5,
              borderColor: colors.primaryOne,
            }}
            onPress={() => handleRecordFunction()}
          >
            <Image
              source={icons.mic}
              style={{
                tintColor: isRecording ? "white" : colors.text,
                width: 25,
                height: 25,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
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
    height: 90,
  },
  playButtonHolder: {
    width: 90,
  },
});
