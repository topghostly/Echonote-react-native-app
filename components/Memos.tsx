import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import * as FileSystem from "expo-file-system";
import Sound from "react-native-sound";

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

  useEffect(() => {
    Sound.setCategory("Playback"); // Set sound environment
  }, []);

  const playMemo = async () => {
    console.log("Started play function");

    const sound = new Sound(fileUri, Sound.DOCUMENT, (error) => {
      if (error) return console.log("Memo playback failed", error);

      sound.play((success) => {
        if (success) {
          console.log("Playing Memo");
        } else {
          console.log("Error playing Memo");
        }

        sound.release();
      });
    });
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
