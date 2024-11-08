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
// import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { throttle } from "lodash";

export default function ModalScreen() {
  const { colors } = useColor(); // Grab color from context provider

  // Input box ref to get name of file
  const inputRef = useRef(null);

  // Set state for recording status
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [amplitude, setAmplitude] = useState(5); // State to hold amplitude level
  const [amplitudeArray, setAmplitudeArray] = useState<number[]>([]);
  const [counterArray, setCounterArray] = useState<number[]>([5, 5, 5, 5]);
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

  // Normalise Audio outut amplitude
  const normalize = (
    value: number,
    min = 0,
    max = 35000,
    newMin = 5,
    newMax = 150
  ) => {
    return Math.round(
      ((value - min) / (max - min)) * (newMax - newMin) + newMin
    );
  };

  const updateAmplituedThrottled = throttle((currentAmplitude: number) => {
    setAmplitude(currentAmplitude);
  }, 300);

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
      const currentAmplitude = calculateAmplitude(buffer);
      updateAmplituedThrottled(normalize(currentAmplitude));
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
  const animatedHeight1 = useSharedValue(5); // animation height default value
  const animatedHeight2 = useSharedValue(5); // animation height default value
  const animatedHeight3 = useSharedValue(5); // animation height default value
  const animatedHeight4 = useSharedValue(5); // animation height default value
  useEffect(() => {
    animatedHeight1.value = withTiming(counterArray[0], { duration: 200 });
    animatedHeight2.value = withTiming(counterArray[1], { duration: 200 });
    animatedHeight3.value = withTiming(counterArray[2], { duration: 200 });
    animatedHeight4.value = withTiming(counterArray[3], { duration: 200 });

    // Update the amplitude array for playback
    setAmplitudeArray((prev) => [...prev, amplitude]);

    // Update amplitude for counters
    setCounterArray((prev) => {
      const newArray = [...prev, amplitude];
      return newArray.length > 4 ? newArray.slice(1) : newArray;
    });
  }, [amplitude]);

  // Animation style fuction
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      height: animatedHeight1.value,
    };
  });
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      height: animatedHeight2.value,
    };
  });
  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      height: animatedHeight3.value,
    };
  });
  const animatedStyle4 = useAnimatedStyle(() => {
    return {
      height: animatedHeight4.value,
    };
  });

  // Function to stop recording
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      const uri = await AudioRecord.stop(); // Stop recording and store the uri
      console.log("Recording stopped. File URI:", uri);
      setAmplitude(5);
      setCounterArray([5, 5, 5, 5]);
      console.log(amplitudeArray);
    } catch (error) {
      console.error("Error stopping recording:", error);
      setAmplitude(5);
      setCounterArray([5, 5, 5, 5]);
    }
    setCounterArray([5, 5, 5, 5]);
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
      setCounterArray([5, 5, 5, 5]);
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
        <Animated.View
          style={[
            {
              width: 70,
              borderRadius: 80,
              backgroundColor: colors.primaryOne,
            },
            animatedStyle1,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 70,
              borderRadius: 80,
              backgroundColor: colors.primaryOne,
            },
            animatedStyle3,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 70,
              borderRadius: 80,
              backgroundColor: colors.primaryOne,
            },
            animatedStyle2,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 70,
              borderRadius: 80,
              backgroundColor: colors.primaryOne,
            },
            animatedStyle4,
          ]}
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
