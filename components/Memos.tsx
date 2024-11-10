import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import * as FileSystem from "expo-file-system";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { useUtil } from "@/context/UtilProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Interfaces and types
interface itemType {
  item: string;
}
interface playType {
  fileUri: string;
  setDuration: any;
  setPosition: any;
  currentPlaying: any;
  setIsCurrentPlaying: any;
}
interface deleteType {
  fileUri: string;
}

// The play audio button components
const PlayButton: React.FC<playType> = ({
  fileUri,
  setDuration,
  setPosition,
  currentPlaying,
  setIsCurrentPlaying,
}) => {
  const { isPlaying, updateIsPlaying } = useUtil();
  const { colors } = useColor();
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State to hold sound object
  useEffect(() => {
    // Cleanup sound when the component is unmounted
    return () => {
      if (sound) {
        sound.unloadAsync(); // Unload sound to free resources
      }
    };
  }, [sound]);

  const playMemo = async () => {
    try {
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );
      updateIsPlaying(true);
      setIsCurrentPlaying(true);
      setSound(playbackObject); // Set the sound object to state
      playbackObject.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setDuration(status.durationMillis);
          setPosition(status.positionMillis);
        }
        // Check if memo playback has ended
        if (status && (status as AVPlaybackStatusSuccess).didJustFinish) {
          console.log("Memo playback finished");
          updateIsPlaying(false);
          setIsCurrentPlaying(false);
        }
      });
    } catch (error) {
      console.log("Error playing Memo", error);
    }
  };

  // function to stop memo
  const stopMemo = async () => {
    try {
      if (sound && isPlaying) {
        // Check if sound is playing
        await sound.pauseAsync();
        setIsCurrentPlaying(false);
        updateIsPlaying(false); // Update state to indicate sound is paused
      }
    } catch (error) {
      console.log("Error pausing Memo", error);
    }
  };
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
      onPress={isPlaying ? stopMemo : playMemo}
    >
      <Image
        source={currentPlaying ? icons.stopPlay : icons.play}
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
const DeleteButton: React.FC<deleteType> = ({ fileUri }) => {
  // Function delete file
  const deleteFiles = async () => {
    try {
      await FileSystem.deleteAsync(fileUri);
      Alert.alert("Success", "File deleted ");
    } catch (error) {
      Alert.alert("Error", "Error deleting memo");
    }
  };
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
      onPress={deleteFiles}
    >
      <Image
        source={icons.del}
        style={{
          width: 30,
          height: 30,
          tintColor: colors.text,
        }}
      />
    </TouchableOpacity>
  );
};

const Memos: React.FC<itemType> = ({ item }) => {
  const [craetedOn, setCreatedOn] = useState<string | Date>();
  const [duration, setDuration] = useState<number | null>(0);
  const [position, setPosition] = useState<number>(0);
  const [currentPlaying, setIsCurrentPlaying] = useState<boolean>(false);
  const [amplitude, setAmplitude] = useState<number[]>([]);

  // File storage uri
  const fileUri = `${FileSystem.documentDirectory}${item}`;

  // Get audio file details
  const getFileDetails = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        const date = new Date(fileInfo.modificationTime * 1000);
        const lastModifiedDate = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        setCreatedOn(lastModifiedDate);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  // Get amplitude details

  const getAsyncDate = async () => {
    try {
      const jsonData = await AsyncStorage.getItem(`memo_${item}`);

      if (jsonData != null) {
        const memoData = JSON.parse(jsonData);
        setAmplitude(memoData.amplitude);
      } else {
        console.log("No data found");
        Alert.alert("Error", "No amplitude data found");
      }
    } catch (error) {
      Alert.alert("Error", "Couuld not get amplitude details");
      console.error(error);
    }
  };

  //Get file details on page load
  useEffect(() => {
    getFileDetails();
    getAsyncDate();
  }, []);

  const normalizeToRange = (normalizingFactor: any, testValue: number) => {
    const maxRange = 200;
    if (!normalizingFactor || isNaN(testValue)) return 0; // Add this to prevent NaN
    const normalizedValue = (testValue / normalizingFactor) * maxRange;
    return Math.min(normalizedValue, maxRange);
  };

  const audioName = item.replace(/\.wav$/, ""); // Remove file extension

  const { colors } = useColor(); // Get colors from context
  const { isPlaying, updateIsPlaying } = useUtil();

  // Playback progress animation logic
  const progressPosition = useSharedValue(0);

  useEffect(() => {
    const newPosition = normalizeToRange(duration, position);
    if (!isNaN(newPosition)) {
      progressPosition.value = withTiming(newPosition, { duration: 800 });
    }
  }, [position, duration]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progressPosition.value || 0 }],
    };
  });

  useEffect(() => {
    if (!currentPlaying) {
      progressPosition.value = 0;
    }
  }, [currentPlaying]);
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
        marginBottom: 5,
      }}
    >
      <PlayButton
        fileUri={fileUri}
        setDuration={setDuration}
        setPosition={setPosition}
        currentPlaying={currentPlaying}
        setIsCurrentPlaying={setIsCurrentPlaying}
      />
      <View style={styles.infoBlock}>
        {currentPlaying ? (
          // Logic for play progress
          <View style={styles.progressHolder}>
            {amplitude.map((height, index) => (
              <View
                key={index}
                style={{
                  width: 3,
                  height: height / 10,
                  backgroundColor: "white",
                  borderRadius: 100,
                }}
              />
            ))}
            <Animated.View
              style={[
                {
                  width: 5,
                  height: 20,
                  backgroundColor: colors.primaryTwo,
                  borderRadius: 100,
                  position: "absolute",
                },
                progressStyle,
              ]}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.memoName} numberOfLines={1}>
              {audioName}
            </Text>
            <Text style={styles.memoDate} numberOfLines={1}>
              {craetedOn?.toString()}
            </Text>
          </View>
        )}
      </View>
      <DeleteButton fileUri={fileUri} />
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
    textTransform: "uppercase",
  },
  memoDate: {
    color: "#949494",
  },
  progressHolder: {
    width: 200,
    height: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
