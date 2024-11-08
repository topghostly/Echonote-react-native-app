import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColor } from "@/context/ColorProvider";
import icons from "@/constants/icons";
import Infolabels from "@/components/Infolabels";
import AddButton from "@/components/AddButton";
import Memos from "@/components/Memos";
import * as FileSystem from "expo-file-system";
const index = () => {
  // Collect color values from context
  const { colors, theme, toggleTheme } = useColor();

  // Update all avialable recordings
  const [recordings, setRecordings] = useState<string[]>([]);
  const [showModalScreen, setShowModalScreen] = useState<boolean>(false);

  // Function to fetch and list recordings
  const fetchRecordings = async () => {
    try {
      // Read all files in the documentDirectory
      if (FileSystem.documentDirectory) {
        const files = await FileSystem.readDirectoryAsync(
          FileSystem.documentDirectory
        );
        const audioFiles = files.filter((file) => file.endsWith(".wav")); // Filter out the .wav files
        setRecordings(audioFiles); // Update the recordings state
      } else {
        console.warn("Document directory is not accessible.");
      }
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  // Delete all files
  const deleteAllFiles = async () => {
    try {
      // Get the list of all files in the document directory
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );

      // Iterate over each file and delete it
      for (const file of files) {
        const filePath = `${FileSystem.documentDirectory}${file}`;

        // Delete the file
        await FileSystem.deleteAsync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }

      console.log("All files have been deleted.");
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  // Get all files on page load
  useEffect(() => {
    fetchRecordings();
    // deleteAllFiles();
  });

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.backgroundColor,
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      <View style={styles.headerHolder}>
        <View>
          <Text
            style={{
              color: colors.text,
              fontFamily: "Causten-Bold",
              fontSize: 55,
            }}
          >
            Beaver
          </Text>
        </View>
        <AddButton size={55} />
      </View>
      {/* using Flat list type */}

      <FlatList
        data={recordings}
        style={{
          paddingVertical: 15,
        }}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Memos item={item} />}
        ListHeaderComponent={(item) => (
          <>
            <View style={styles.infoHolder}>
              <Infolabels
                info="Total saved voice memo"
                amount={recordings.length}
              />
              <Infolabels info="Total favorite voice memo" amount={0} />
            </View>
            <View
              style={{
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Causten-SemiBold",
                  fontSize: 20,
                }}
              >
                Memo List
              </Text>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  scrollHolder: {
    paddingTop: 10,
  },

  headerHolder: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 10,
  },

  infoHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 15,
  },

  memoListHolder: {
    paddingVertical: 15,
  },
});
