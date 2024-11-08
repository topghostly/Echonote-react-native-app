import { StatusBar } from "expo-status-bar";
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import { useState, useEffect, useRef } from "react";
import AudioRecord from "react-native-audio-record";
import { PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";

export default function ModalScreen() {
  const { colors } = useColor(); // Grab color from context provider

  // Input box ref to get name of file
  const inputRef = useRef(null);

  // Set state for recording status
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [amplitude, setAmplitude] = useState(0); // State to hold amplitude level
  const [amplitudeArray, setAmplitudeArray] = useState<number[]>([]);
  const [audioName, setAudioName] = useState<String>(() => {
    const randNum = Math.floor(Math.random() * 100000) + 1;
    const newName = "MEMO_" + randNum.toString() + ".wav";
    console.log(newName);
    return newName;
  });
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

  // const AUDIO_FILE_PATH = `${FileSystem.documentDirectory}/new/filename.wav`;
  const filteredAmplitude: number[] = [];

  // Normalise Audio outut amplitude
  function normalize(
    value: number,
    min = 0,
    max = 35000,
    targetMin = 1,
    targetMax = 100
  ) {
    const mappedValue =
      targetMin + ((value - min) / (max - min)) * (targetMax - targetMin);
    return Math.round(mappedValue * 100) / 100; // Rounds to 2 decimal places
  }

  const startRecording = async () => {
    // Configure AudioRecord
    AudioRecord.init({
      sampleRate: 16000, // Audio frequency (adjust as needed)
      channels: 1, // Mono channel
      bitsPerSample: 16,
      audioSource: 6, // Microphone
      wavFile: `${audioName}`,
    });

    // Listener for real-time data
    AudioRecord.on("data", (data) => {
      const buffer = Buffer.from(data, "base64");
      const currentAmplitude = calculateAmplitude(buffer) * 2;
      isRecording && setAmplitude(normalize(currentAmplitude)); // Update amplitude level
    });

    // Start recording logic
    try {
      setIsRecording(true);
      await AudioRecord.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    console.log(amplitude);
    setAmplitudeArray((prev) => [...prev, amplitude]);
  }, [amplitude]);

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      const uri = await AudioRecord.stop(); // Stop recording and store the uri
      console.log("Recording stopped. File URI:", uri);
      setAmplitude(0);
      console.log(amplitudeArray);
    } catch (error) {
      console.error("Error stopping recording:", error);
      setAmplitude(0);
    }
  };

  // Save and back to home
  // const saveMemo = async () => {
  //   if (memoUri) {
  //     try {
  //       await FileSystem.copyAsync({
  //         from: "/data/user/0/com.bossbeaver.EchoNote/files/MEMO_89207.wav",
  //         to: AUDIO_FILE_PATH,
  //       });
  //       console.log("Audio file saved at:", AUDIO_FILE_PATH);

  //       router.replace("/");
  //     } catch (error) {
  //       console.log("Error occured while saving, ", error);
  //       router.replace("/");
  //     }
  //   }
  // };

  // Handle record button onpress

  const handleRecordFunction = () => {
    if (isRecording) {
      stopRecording();
      console.log(filteredAmplitude);
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
        paddingTop: 50,
        justifyContent: "space-between",
      }}
    >
      {/* Header part */}
      <View style={styles.headerContainer}>
        <View style={styles.submitButtonHolder}>
          <TouchableOpacity
            style={{
              width: 80,
              aspectRatio: 1,
              backgroundColor: colors.text,
              borderRadius: 1000,
              borderCurve: "continuous",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              router.replace("/");
            }}
          >
            <Image
              source={icons.check}
              style={{ tintColor: "white", width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mid setion */}
      <View style={styles.counterHolder}>
        <View
          style={{
            width: 70,
            borderRadius: 80,
            height: 200,
            backgroundColor: colors.primaryOne,
          }}
        />
        <View
          style={{
            width: 70,
            borderRadius: 80,
            height: 50,
            backgroundColor: colors.primaryOne,
          }}
        />
        <View
          style={{
            width: 70,
            borderRadius: 80,
            height: 50,
            backgroundColor: colors.primaryOne,
          }}
        />
        <View
          style={{
            width: 70,
            borderRadius: 80,
            height: 100,
            backgroundColor: colors.primaryOne,
          }}
        />
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
    justifyContent: "flex-end",
  },
  nameInputContainer: {
    height: 50,
    paddingHorizontal: 10,
    flex: 1,
  },
  submitButtonHolder: {
    width: 80,
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
  counterHolder: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
