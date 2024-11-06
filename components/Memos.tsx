import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import * as FileSystem from "expo-file-system";
import Sound from "react-native-sound";
import { Audio } from "expo-av";

// Interfaces and types
interface itemType {
  item: string;
}
interface playType {
  fileUri: string;
}

// The play audio button components
const PlayButton: React.FC<playType> = ({ fileUri }) => {
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
      setSound(playbackObject); // Set the sound object to state

      console.log("Playing Memo");
      playbackObject.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log("Memo playback finished");
        }
      });
    } catch (error) {
      console.log("Error playing Memo", error);
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
      onPress={playMemo}
    >
      <Image
        source={icons.play}
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
const OptionsButton: React.FC = () => {
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
    >
      <Image
        source={icons.options}
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

  // File storage uri
  const fileUri = `${FileSystem.documentDirectory}${item}`;

  // Get audio file details
  const getFileDetails = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        const date = new Date(fileInfo.modificationTime * 1000);
        console.log(fileInfo.size);
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

  //Get file details on page load
  useEffect(() => {
    getFileDetails();
  }, []);

  const audioName = item.replace(/\.wav$/, ""); // Remove file extension

  const { colors } = useColor(); // Get colors from context
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
      <PlayButton fileUri={fileUri} />
      <View style={styles.infoBlock}>
        <Text style={styles.memoName} numberOfLines={1}>
          {audioName}
        </Text>
        <Text style={styles.memoDate} numberOfLines={1}>
          {craetedOn?.toString()}
        </Text>
      </View>
      <OptionsButton />
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
});
